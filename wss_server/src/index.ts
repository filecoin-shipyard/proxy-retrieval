import * as chalk from 'chalk'
import * as socketIO from 'socket.io'

import { config } from './config'
import { logger } from './services/logger'
import { sendCidAvailability } from './services/send-cid-availability'
import { sendFundsConfirmed } from './services/send-funds-confirmed'

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
  })
})

logger.log(chalk.green`listening on port`, config.port)

io.listen(config.port)
