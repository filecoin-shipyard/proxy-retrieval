import * as socketIO from 'socket.io'
import { config } from './config'

const io = socketIO()

io.on('connection', (client) => {
  console.log(`Got connection from`, client)
})

console.log(`listening on port`, config.port)

io.listen(config.port)
