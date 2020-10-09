import * as socketIO from 'socket.io'

export const sendChunk = (io: socketIO.Server, message) => {
  try {
    // TODO: here

    io.emit('chunk', {
      message: 'chunk',
      id: 1,
      cid: 'bafk2bzacebbhqzi4y546h7gjbduauzha6z33ltequ7hpbvywnttc57xrwcit2',
      chunk_len_bytes: 52428800, // # example: 50 MiB
      chunk_sha256: '8XvWaZ/iZi2/1Jufgq2MNSwthO1hPH79gIMBKvIfJBw=',
      full_data_len_bytes: 1073741824, // # example: 1 GiB
      full_data_sha256: 'G8XZoly6RZecw6HNSUOD4xeO5Sqq/mA33E75i3JkVpg=',
      chunk_data: 'Qx+tbi3w1eO0aV7JtGjsP[...]InkQMjxgRCGejnBklLq2bnI=',
    })
  } catch (err) {
    // TODO: error handling
  }
}
