import * as fs from 'fs-extra'
import * as readChunk from 'read-chunk'
import * as socketIO from 'socket.io'

import { confirmFile, get, updateBytesSent } from './db-clients'
import { logger } from './logger'
import * as lotus from './lotus'
import { sha256 } from './sha256'
import { sha256File } from './sha256-file'

const chunkSize = 1024 * 102

export const sendChunk = async (io: socketIO.Server, message) => {
  try {
    const entry = await get(message)
    logger.log(`Preparing chunk [token:${message.clientToken}] [cid:${entry.cidRequested}]`)

    // retrieve file if it doesn't exist
    if (!entry.tempFileChecksum) {
      // const tempFilePath = await lotus.retrieve(entry.cidRequested, entry.minerRequested, entry.walletAddress)

      // TODO: temp remove it later
      const tempFilePath = await lotus.retrieve(
        'bafk2bzaced7r5ss6665h7d4s4qupduojmiuvmhqoiknmun5mawa3xj2s3lqmq',
        'f033048',
        'f1xgvqfhauw3r2cuhjp3n3ajlriwvt6m4lofoh2zy',
      )

      const tempFileChecksum = await sha256File(tempFilePath)
      console.log('message', message)
      console.log('tempFilePath', tempFilePath)
      console.log('tempFileChecksum', tempFileChecksum)

      await confirmFile({ ...message, tempFilePath, tempFileChecksum })
    }
    ///

    const fileStat = await fs.stat(entry.tempFilePath)

    const startByte = message.id || 0
    const toByte = startByte + chunkSize

    const chunk = await readChunk(entry.tempFilePath, startByte, toByte)

    const chunkMessage = {
      message: 'chunk',
      id: entry.bytesSent,
      cid: entry.cidRequested,
      chunk_len_bytes: chunk.length,
      chunk_sha256: sha256(chunk),
      full_data_len_bytes: fileStat.size,
      full_data_sha256: entry.tempFileChecksum,
      chunk_data: chunk.toString('base64'),
    }

    io.emit('chunk', chunkMessage)

    await updateBytesSent({ clientToken: entry.clientToken, bytesSent: entry.bytesSent + chunkSize })
  } catch (err) {
    logger.error(err)
    // TODO: error handling
  }
}
