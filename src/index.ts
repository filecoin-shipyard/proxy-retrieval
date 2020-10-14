import * as chalk from 'chalk'
import * as socketIO from 'socket.io'

import { env } from './config'
import { logger } from './services/logger'
import { sendChunk } from './services/send-chunk'
import { sendCidAvailability } from './services/send-cid-availability'
import { sendFundsConfirmed } from './services/send-funds-confirmed'
import { sleep } from './services/sleep'

const start = () => {
  const io = socketIO()

  io.on('connection', (client) => {
    logger.log(chalk.greenBright`Got a connection from`, client.id)

    client.on('query_cid', (message) => {
      logger.log(chalk.blueBright`Got a message from`, client.id, 'message:\n', message)

      sendCidAvailability(io, message)
    })

    client.on('funds_confirmed', (message) => {
      logger.log(chalk.blueBright`Got a message from`, client.id, 'message:\n', message)

      sendFundsConfirmed(io, message)
      sendChunk(io, message)
    })

    client.on('chunk_received', (message) => {
      // TODO: send next chunk if any
      logger.log(chalk.blueBright`Client got the chunk`, message.id)
      sendChunk(io, message)
    })

    client.on('chunk_resend', async (message) => {
      // TODO: re-send same chunk
      logger.log(chalk.yellowBright`Client is asking to resend chunk`, message.id)

      await sleep(5000)
      sendChunk(io, { ...message, id: message.id - 1 })
    })
  })

  io.on('disconnect', (client) => {
    logger.log(chalk.redBright`Disconnected from`, client.id)
  })

  logger.log(chalk.green`listening on port`, env.port)

  io.listen(env.port)
}

start()
