import * as chalk from 'chalk'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as readChunk from 'read-chunk'
import * as socketIO from 'socket.io'
import { env } from '../config'

import { confirmFile, get, updateBytesSent } from './db-clients'
import { logger } from './logger'
import * as lotus from './lotus'
import { sha256 } from './sha256'
import { sha256File } from './sha256-file'

const chunkSize = 1024 // * 1024 * 1 // 1 MB

export const sendChunk = async (io: socketIO.Server | socketIO.Socket, message) => {
  try {
    const entry = await get(message)
    logger.log(`Preparing chunk [token:${message.clientToken}] [cid:${entry.cidRequested}]`)

    // retrieve file if it doesn't exist
    const filePath = path.join(env.rootDir, env.lotus.retrievePathLocal, entry.cidRequested)
    logger.log(`Looking for ${entry.cidRequested} locally at '${filePath}'`)
    logger.log(`  env.rootDir: '${env.rootDir}'`)
    logger.log(`  env.lotus.retrievePathLocal: '${env.lotus.retrievePathLocal}'`)
    if (!fs.existsSync(filePath)) {
      logger.log(
        `Did not find ${entry.cidRequested} locally; performing storage miner retrieve from ${entry.minerRequested} instead`,
      )
      await lotus.retrieve(entry.cidRequested, entry.minerRequested, entry.walletAddress, filePath)
    } else {
      logger.log(`Found ${entry.cidRequested} locally; no storage miner retrieval needed`)
    }

    const tempFileChecksum = await sha256File(filePath)

    await confirmFile({ ...message, tempFilePath: filePath, tempFileChecksum })

    const fileStat = await fs.stat(filePath)

    const startByte = message.id || 0
    const sizeToRead = startByte + chunkSize > fileStat.size ? fileStat.size - startByte : chunkSize

    if (startByte >= fileStat.size) {
      // send "EOF"
      io.emit('chunk', {
        message: 'chunk',
        eof: true,
        cid: message.cid,
        full_data_len_bytes: fileStat.size,
      })

      return
    }

    logger.log(chalk.blueBright`Reading from ${startByte} to ${startByte + sizeToRead} (chunk size: ${sizeToRead})`)
    const chunk = await readChunk(filePath, startByte, sizeToRead)

    const bytesSent = entry.bytesSent + sizeToRead > fileStat.size ? fileStat.size : entry.bytesSent + sizeToRead

    const chunkMessage = {
      message: 'chunk',
      id: bytesSent,
      cid: entry.cidRequested,
      chunk_len_bytes: chunk.length,
      chunk_sha256: sha256(chunk),
      full_data_len_bytes: fileStat.size,
      full_data_sha256: entry.tempFileChecksum,
      chunk_data: chunk.toString('base64'),
    }

    io.emit('chunk', chunkMessage)

    await updateBytesSent({ clientToken: entry.clientToken, bytesSent })
  } catch (err) {
    logger.error('Could not send chunk.', err)
    // TODO: error handling
  }
}
