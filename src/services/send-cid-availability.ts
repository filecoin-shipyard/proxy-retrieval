import { AxiosError } from 'axios'
import BigNumber from 'bignumber.js'
import * as socketIO from 'socket.io'

import { registerClient } from './db-clients'
import { logger } from './logger'
import * as lotus from './lotus'
import { createToken } from './token'

const messageType = 'cid_availability'

export const sendCidAvailability = async (io: socketIO.Server, message) => {
  try {
    logger.log(`Getting CID availability [token:${message.clientToken}] [cid:${message.cid}]`)

    const data = await lotus.getClientMinerQueryOffer(message.miner, message.cid)
    const isAvailable = !data.result.Err
    const priceAttofil = new BigNumber(data.result.MinPrice).plus(data.result.UnsealPrice)
    const paymentWallet = await lotus.walletNew()
    const clientToken = createToken(message)

    const replyMessage = {
      message: messageType,
      cid: message.cid,
      client_token: clientToken,
      available: isAvailable,

      price_attofil: priceAttofil.toString(),
      payment_wallet: paymentWallet.result,
    }

    if (isAvailable) {
      logger.log(`Registering client [token:${message.clientToken}] [cid:${message.cid}]`)

      await registerClient({
        cidRequested: message.cid,
        minerRequested: message.miner,
        clientToken: clientToken,
        priceAttofil: priceAttofil.toString(),
        walletAddress: paymentWallet.result,
        walletPrivateKey: '// TODO: do we need this?',
      })
    }

    io.emit(messageType, replyMessage)
  } catch (err) {
    logger.error(err.toJSON ? (err as AxiosError).toJSON() : err)

    // TODO: how do we handle errors?
    io.emit(messageType, {
      message: messageType,
      cid: message.cid,
      available: false,
    })
  }
}
