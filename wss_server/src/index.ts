import * as socketIO from 'socket.io'
import { config } from './config'
import * as chalk from 'chalk'

const io = socketIO()

io.on('connection', (client) => {
  console.log(chalk.greenBright`Got a connection from`, client.id)

  client.on('initialize', (message) => {
    console.log(chalk.blueBright`Got a message from`, client.id, 'message:', message)
  })
})

console.log(`listening on port`, config.port)

io.listen(config.port)
