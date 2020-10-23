import * as socketIO from 'socket.io'

export const sendFundsConfirmed = (io: socketIO.Server, _message) => {
  try {
    // TODO: confirm funds
    io.emit('funds_confirmed', {
      message: 'funds_confirmed',
      cid: 'bafk2bzacebbhqzi4y546h7gjbduauzha6z33ltequ7hpbvywnttc57xrwcit2',
      payment_wallet: 'f1stoztiw5sxeyvezjttq5727wfdkooweskpue5fa',
    })
  } catch (err) {
    // TODO: error handling

    // FundsConfirmedErrorInsufficientFunds
    io.emit('cid_availability', {
      message: 'funds_confirmed_error_insufficient_funds',
      cid: 'bafk2bzacebbhqzi4y546h7gjbduauzha6z33ltequ7hpbvywnttc57xrwcit2',
      payment_wallet: 'f1stoztiw5sxeyvezjttq5727wfdkooweskpue5fa',
      remaining_balance: '50000',
    })

    // FundsConfirmedErrorPriceChanged
    io.emit('cid_availability', {
      message: 'funds_confirmed_error_price_changed',
      cid: 'bafk2bzacebbhqzi4y546h7gjbduauzha6z33ltequ7hpbvywnttc57xrwcit2',
      payment_wallet: 'f1stoztiw5sxeyvezjttq5727wfdkooweskpue5fa',
      remaining_balance: '50000',
    })
  }
}
