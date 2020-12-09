import * as socketIO from 'socket.io'

import { Clients } from '../models/clients'
import { logger } from './logger'

const messageType = 'funds_confirmed_error_insufficient_funds'

export const sendFundsInsufficientFunds = async (
  io: socketIO.Server | socketIO.Socket,
  message,
  entry: Clients,
  remainingBalance,
) => {
  try {
    logger.log(`Sending insufficient funds [token:${message.clientToken}] [cid:${entry.cidRequested}]`)

    io.emit(messageType, {
      message: messageType,
      cid: entry.cidRequested,
      paymentWallet: entry.walletAddress,
      remainingBalance,
      priceAttofil: entry.priceAttofil,
      clientToken: message.clientToken,
    })
  } catch (err) {
    logger.error(err)
  }
}
