import * as chalk from 'chalk'
import * as socketIO from 'socket.io'

import { config } from './config'
import { logger } from './services/logger'
import { sendChunk } from './services/send-chunk'
import { sendCidAvailability } from './services/send-cid-availability'
import { sendFundsConfirmed } from './services/send-funds-confirmed'
import { sleep } from './services/sleep'

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

    await sleep(3000)
    sendChunk(io, { ...message, id: message.id - 1 })
  })
})

logger.log(chalk.green`listening on port`, config.port)

io.listen(config.port)
