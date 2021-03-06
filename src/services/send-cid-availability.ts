import { AxiosError } from 'axios'
import BigNumber from 'bignumber.js'
import * as socketIO from 'socket.io'

import { registerClient } from './db-clients'
import { logger } from './logger'
import * as lotus from './lotus'
import { createToken } from './token'

const messageType = 'cid_availability'
// to Retrieve from miner wallet need 0.1 minimum balance
const minimumPriceForRetrievalPerGb = new BigNumber('10100000000000000')
const gasCostPerProxyRetrieval = new BigNumber('32803602238')

export const sendCidAvailability = async (io: socketIO.Server | socketIO.Socket, message) => {
  try {
    logger.log(`Getting CID availability [token:${message.clientToken}] [cid:${message.cid}]`)

    const data = await lotus.getClientMinerQueryOffer(message.miner, message.cid)
    logger.log('getClientMinerQueryOffer() =>\n', data)

    const isAvailable = !data.result.Err
    const priceAttofil = new BigNumber(data.result.MinPrice).plus(data.result.UnsealPrice)
    // const paymentWallet = await lotus.walletNew()
    // JUST FOR TESTING!! Use same wallet for all transfers (TO BE REMOVED)
    const paymentWallet = { result: 'f1xgvqfhauw3r2cuhjp3n3ajlriwvt6m4lofoh2zy' }
    const clientToken = createToken(message)
    const size = new BigNumber(data.result.Size)

    const priceWithGas = priceAttofil
      .plus(gasCostPerProxyRetrieval)
      .plus(minimumPriceForRetrievalPerGb.times(10))
      .toString()

    const replyMessage = {
      message: messageType,
      cid: message.cid,
      clientToken,
      available: isAvailable,
      approxSize: size.dividedBy(2).toNumber(),

      priceAttofil: priceWithGas,
      paymentWallet: paymentWallet.result,
    }

    if (isAvailable) {
      logger.log(`Registering client [token:${message.clientToken}] [cid:${message.cid}]`)

      await registerClient({
        cidRequested: message.cid,
        minerRequested: message.miner,
        clientToken,
        priceAttofil: priceWithGas,
        walletAddress: paymentWallet.result,
        walletPrivateKey: '// TODO: do we need this?',
      })
    }

    io.emit(messageType, replyMessage)
  } catch (err) {
    logger.error(err.toJSON ? (err as AxiosError).toJSON() : err)

    // TODO: how do we handle errors?
    io.emit(messageType, {
      message: messageType,
      cid: message.cid,
      available: false,
      clientToken: message.clientToken,
    })
  }
}
