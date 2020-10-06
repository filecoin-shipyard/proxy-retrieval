import * as chalk from 'chalk'
import * as socketIO from 'socket.io'

import { config } from './config'
import { getCidAvailability } from './services/get-cid-availability'
import { logger } from './services/logger'

const io = socketIO()

io.on('connection', (client) => {
  logger.log(chalk.greenBright`Got a connection from`, client.id)

  client.on('query_cid', (message) => {
    logger.log(chalk.blueBright`Got a message from`, client.id, 'message:\n', message)

    getCidAvailability(io, message)
  })

  client.on('funds_confirmed', (message) => {
    // TODO: here
  })
})

logger.log(chalk.green`listening on port`, config.port)

io.listen(config.port)
