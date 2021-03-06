import * as socketIO from 'socket.io'

import { confirmFunds } from './db-clients'
import { logger } from './logger'

export const sendFundsConfirmed = async (io: socketIO.Server | socketIO.Socket, message) => {
  try {
    logger.log(`Registering funds confirmed [token:${message.clientToken}] [cid:${message.cid}]`)
    await confirmFunds(message)

    io.emit('funds_confirmed', {
      message: 'funds_confirmed',
      cid: message.cid,
      clientToken: message.clientToken,
      // paymentWallet: 'f1stoztiw5sxeyvezjttq5727wfdkooweskpue5fa', // TODO: do we need this?
    })
  } catch (err) {
    logger.error(err)
    // TODO: error handling

    // FundsConfirmedErrorPriceChanged
    io.emit('funds_confirmed_error_price_changed', {
      message: 'funds_confirmed_error_price_changed',
      cid: 'bafk2bzacebbhqzi4y546h7gjbduauzha6z33ltequ7hpbvywnttc57xrwcit2',
      paymentWallet: 'f1stoztiw5sxeyvezjttq5727wfdkooweskpue5fa',
      remainingBalance: '50000',
      clientToken: message.clientToken,
    })
  }
}
