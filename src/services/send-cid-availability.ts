import * as socketIO from 'socket.io'

export const sendCidAvailability = async (io: socketIO.Server, message) => {
  try {
    // TODO: retrieve availability from lotus
    return io.emit('cid_availability', {
      message: 'cid_availability',
      cid: 'bafk2bzacebbhqzi4y546h7gjbduauzha6z33ltequ7hpbvywnttc57xrwcit2',
      client_token: 'HIgP2JW9wHdlTYb89rjEy9/IQDR02EwMvtg4XN5Y/kY=',
      available: true,
      price_attofil: '1000000',
      payment_wallet: 'f1stoztiw5sxeyvezjttq5727wfdkooweskpue5fa',
    })
  } catch (err) {
    io.emit('cid_availability', {
      message: 'cid_availability',
      cid: 'bafk2bzacebbhqzi4y546h7gjbduauzha6z33ltequ7hpbvywnttc57xrwcit2',
      available: false,
    })
  }
}
