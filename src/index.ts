import * as chalk from 'chalk'
import * as socketIO from 'socket.io'

import { env } from './config'
import { toJSCase } from './services/case'
import { logger } from './services/logger'
import { sendChunk } from './services/send-chunk'
import { sendCidAvailability } from './services/send-cid-availability'
import { sendFundsConfirmed } from './services/send-funds-confirmed'
import { sleep } from './services/sleep'
import { validateAndDecodeToken } from './services/token'

const start = () => {
  const io = socketIO()

  io.on('connection', (client) => {
    logger.log(chalk.greenBright`Got a connection from`, client.id)

    client.on('query_cid', (message) => {
      logger.log(chalk.blueBright`Got a message query_cid from`, client.id, 'message:\n', message)

      const messageJS = toJSCase(message)
      sendCidAvailability(client, messageJS)
    })

    client.on('funds_confirmed', async (message) => {
      logger.log(chalk.blueBright`Got a message funds_confirmed from`, client.id, 'message:\n', message)
      const messageJS = toJSCase(message)

      const token = validateAndDecodeToken(messageJS)

      if (!token) {
        return
      }

      // TODO: confirm funds
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // if funds confirmed
        // eslint-disable-next-line no-constant-condition
        if (1) {
          break
        }

        await sleep(5000)
      }

      // TODO: remove
      await sleep(1000)

      await sendFundsConfirmed(client, messageJS)
      logger.log(chalk.redBright`----------------------------------`)
      sendChunk(client, messageJS)
    })

    client.on('chunk_received', (message) => {
      logger.log(chalk.blueBright`Got a message chunk_received from`, client.id, 'message:\n', message)

      const messageJS = toJSCase(message)
      const token = validateAndDecodeToken(messageJS)

      if (!token) {
        return
      }

      // TODO: send next chunk if any
      logger.log(chalk.blueBright`Client got the chunk`, messageJS.id)
      sendChunk(client, messageJS)
    })

    client.on('chunk_resend', async (message) => {
      logger.log(chalk.blueBright`Got a message chunk_resend from`, client.id, 'message:\n', message)

      const messageJS = toJSCase(message)
      const token = validateAndDecodeToken(messageJS)

      if (!token) {
        return
      }

      // TODO: re-send same chunk
      logger.log(chalk.yellowBright`Client is asking to resend chunk`, messageJS.id)

      await sleep(3000)
      sendChunk(client, { ...messageJS, id: messageJS.id - 1 })
    })

    client.on('disconnect', async (...args) => {
      logger.log(chalk.redBright`Client disconnected`, ...args)
    })
  })

  io.on('disconnect', (client) => {
    logger.log(chalk.redBright`Disconnected from`, client.id)
  })

  logger.log(chalk.green`listening on port`, env.port)

  io.listen(env.port)
}

start()
