import { AxiosError } from 'axios'
import * as socketIO from 'socket.io'

import { logger } from './logger'
import * as lotus from './lotus'

const messageType = 'cid_availability'

export const sendCidAvailability = async (io: socketIO.Server, message) => {
  try {
    // TODO: retrieve availability from lotus
    // const data = await lotus.getClientMinerQueryOffer('t01352', message.cid)
    const data = await lotus.version()
    console.log('data', data)
    console.log('-------')

    const isAvailable = true
    const priceAttofil = '1000000'
    const paymentWallet = 'f1stoztiw5sxeyvezjttq5727wfdkooweskpue5fa'
    const clientToken = 'HIgP2JW9wHdlTYb89rjEy9/IQDR02EwMvtg4XN5Y/kY='

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
