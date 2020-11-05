import axios from 'axios'
import BigNumber from 'bignumber.js'
import * as intervalPromise from 'interval-promise'

import { env } from '../config'
import { logger } from './logger'

const { api: apiUrl, token } = env.lotus
const retrieveTimeout = 30 * 60000 // 30 mins

const interval = (intervalPromise as any) as typeof intervalPromise.default

export enum FundsStatus {
  FundsConfirmed,
  ErrorInsufficientFunds,
  ErrorPriceChanged,
}

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})

const callLotus = async (body, timeout = 10000) => {
  const { data } = await api.post('', body, { timeout })

  return data
}

export const version = () => {
  return callLotus({ jsonrpc: '2.0', method: 'Filecoin.Version', params: [], id: 0 })
}

export const getClientMinerQueryOffer = (miner: string, dataCid: string) => {
  return callLotus({
    jsonrpc: '2.0',
    method: 'Filecoin.ClientMinerQueryOffer',
    params: [miner, { '/': dataCid }, null],
    id: 0,
  })
}

export const getClientRetrieve = (retrievalOffer, outFile) => {
  return callLotus(
    {
      jsonrpc: '2.0',
      method: 'Filecoin.ClientRetrieve',
      params: [retrievalOffer, { Path: outFile, IsCAR: false }],
      id: 0,
    },
    retrieveTimeout,
  )
}

// Generate a Secp256k1 wallet
export const walletNew = () => {
  const KTrashPrefix = 1
  return callLotus({ jsonrpc: '2.0', method: 'Filecoin.WalletNew', params: [KTrashPrefix], id: 0 })
}

export const walletBalance = (wallet) => {
  return callLotus({ jsonrpc: '2.0', method: 'Filecoin.WalletBalance', params: [wallet], id: 0 })
}

export const createWallet = async (): Promise<string> => {
  const newWallet = await walletNew()
  const wallet = newWallet.result

  logger.log(`new wallet: ${wallet}`)

  return wallet.result
}

export const confirmFunds = async (wallet, requiredFunds, iterations = 240): Promise<FundsStatus> => {
  const requiredFundsBN = new BigNumber(requiredFunds)
  let fundsStatus = FundsStatus.ErrorInsufficientFunds

  // iterate for 20 minutes, waiting 5 seconds before each iteration
  await interval(
    async (_iteration, stop) => {
      const balance = await walletBalance(wallet)
      if (balance) {
        const balanceBN = new BigNumber(balance.result)
        if (balanceBN.comparedTo(requiredFundsBN) == 1 || balanceBN.comparedTo(requiredFundsBN) == 0) {
          fundsStatus = FundsStatus.FundsConfirmed
          stop()
        }
      }
    },
    5000,
    { iterations },
  )

  return fundsStatus
}

export const queryMinerOffer = async (dataCid, minerID) => {
  const queryOffer = await getClientMinerQueryOffer(minerID, dataCid)
  logger.log('Query Offer:', queryOffer)

  if (queryOffer.error || !queryOffer.result) {
    logger.error('ClientMinerQueryOffer:', queryOffer.error)

    return
  }

  return queryOffer.result
}

export const getCIDAvailability = async (dataCid, minerID) => {
  const result = { availability: false, wallet: null, price: null }

  try {
    const ver = await version()
    logger.log(ver)

    const queryOffer = await queryMinerOffer(dataCid, minerID)
    if (queryOffer) {
      const wallet = await createWallet()
      result.availability = true
      result.wallet = wallet
      result.price = queryOffer.MinPrice + queryOffer.UnsealPrice
    }
  } catch (err) {
    logger.error(err)
  }

  return result
}

// TODO: this no longer needs to return the filepath since we pass it in
export const retrieve = async (dataCid: string, minerID: string, wallet: string, outFilePath: string) => {
  logger.log(`retrieve:  dataCid:${dataCid}, minerID:'${minerID}', wallet:'${wallet}', outFilePath:'${outFilePath}'`)

  try {
    const queryOffer = await queryMinerOffer(dataCid, minerID)

    if (queryOffer) {
      const retrievalOffer = {
        Root: queryOffer.Root,
        Piece: null,
        Size: queryOffer.Size,
        Total: queryOffer.MinPrice,
        UnsealPrice: queryOffer.UnsealPrice,
        PaymentInterval: queryOffer.PaymentInterval,
        PaymentIntervalIncrease: queryOffer.PaymentIntervalIncrease,
        Client: wallet,
        Miner: queryOffer.Miner,
        MinerPeer: queryOffer.MinerPeer,
      }

      const retrieveResult = await getClientRetrieve(retrievalOffer, outFilePath)

      logger.log('retrieve result: ', retrieveResult)

      if (retrieveResult.error) {
        outFilePath = undefined
        throw new Error(JSON.stringify(retrieveResult.error))
      }
    }
  } catch (err) {
    logger.error('Error retrieving file\n', err)
  }

  return outFilePath
}
