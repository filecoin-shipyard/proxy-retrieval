import { AxiosError } from 'axios'
import * as socketIO from 'socket.io'

import { logger } from './logger'
import * as lotus from './lotus'

import * as jwt from 'jsonwebtoken'
import { env } from '../config'

const messageType = 'cid_availability'

export const sendCidAvailability = async (io: socketIO.Server, message) => {
  try {
    const data = await lotus.getClientMinerQueryOffer(message.miner, message.cid)
    console.log('data', data)
    console.log('-------')

    const isAvailable = !data.result.Err
    const priceAttofil = data.result.MinPrice
    // TODO: get wallet
    const paymentWallet = 'f1stoztiw5sxeyvezjttq5727wfdkooweskpue5fa'
    const clientToken = jwt.sign(message, env.token.secret, { expiresIn: env.token.expiresIn })

    const replyMessage = {
      message: messageType,
      cid: message.cid,
      client_token: clientToken,
      available: isAvailable,

      price_attofil: priceAttofil,
      payment_wallet: paymentWallet,
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

// TODO: remove; data to test with:
//
// bafk2bzaced7r5ss6665h7d4s4qupduojmiuvmhqoiknmun5mawa3xj2s3lqmq
// f033048
