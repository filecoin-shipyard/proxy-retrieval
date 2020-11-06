import * as socketIO from 'socket.io'

export const sendRetrievalStatusResponse = (io: socketIO.Server, message) => {
  try {
    // TODO: get status from lotus

    // To indicate that the retrieval from the storage miner has not yet started:
    io.emit('retrieval_status_response', {
      message: 'retrieval_status_response',
      cid: 'bafk2bzacebbhqzi4y546h7gjbduauzha6z33ltequ7hpbvywnttc57xrwcit2',
      status: 'PREPARING',
      clientToken: message.clientToken,
    })

    // To indicate that the retrieval from the storage miner has started but has not yet finished (this my be extended in the future to include a percentage done indicator):
    io.emit('retrieval_status_response', {
      message: 'retrieval_status_response',
      cid: 'bafk2bzacebbhqzi4y546h7gjbduauzha6z33ltequ7hpbvywnttc57xrwcit2',
      status: 'IN_PROGRES',
      clientToken: message.clientToken,
    })

    // To indicate that the retrieval from the storage miner has completed successfully:
    io.emit('retrieval_status_response', {
      message: 'retrieval_status_response',
      cid: 'bafk2bzacebbhqzi4y546h7gjbduauzha6z33ltequ7hpbvywnttc57xrwcit2',
      status: 'COMPLETE',
      clientToken: message.clientToken,
    })

    // To indicate that the retrieval from the storage miner resulted in an unrecoverable error:
    io.emit('retrieval_status_response', {
      message: 'retrieval_status_response',
      cid: 'bafk2bzacebbhqzi4y546h7gjbduauzha6z33ltequ7hpbvywnttc57xrwcit2',
      status: 'FAILURE',
      clientToken: message.clientToken,
      msg: 'Error: segfault in wss_server/src/whatever.js:414',
    })
  } catch (err) {
    // TODO: error handling
  }
}
