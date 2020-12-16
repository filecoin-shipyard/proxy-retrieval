import * as chalk from 'chalk'
import * as socketIO from 'socket.io'

import { env } from './config'
import { toJSCase } from './services/case'
import { startDb } from './services/database'
import { get } from './services/db-clients'
import { logger } from './services/logger'
import { confirmFunds, FundsStatus } from './services/lotus'
import { sendChunk } from './services/send-chunk'
import { sendCidAvailability } from './services/send-cid-availability'
import { sendFundsConfirmed } from './services/send-funds-confirmed'
import { sendFundsInsufficientFunds } from './services/send-funds-insufficient-funds'
import { sleep } from './services/sleep'
import { validateAndDecodeToken } from './services/token'

const start = async () => {
  await startDb()

  const io = socketIO({
    pingTimeout: 60000, // 1 minute without a pong packet to consider the connection closed
  })

  io.on('connection', (client) => {
    logger.log(chalk.greenBright`Got a connection from test`, client.id)

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

      const entry = await get(message)
      const { status, balance } = await confirmFunds(entry.walletAddress, entry.priceAttofil)

      switch (status) {
        case FundsStatus.FundsConfirmed:
          await sendFundsConfirmed(client, messageJS)
          sendChunk(client, messageJS)
          break

        case FundsStatus.ErrorInsufficientFunds:
          await sendFundsInsufficientFunds(client, messageJS, entry, balance)
          break

        case FundsStatus.ErrorPriceChanged:
          // TODO: FundsStatus.ErrorPriceChanged
          break
      }
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
