import axios from 'axios'
import uniqueFilename from 'unique-filename'

import { env } from '../config'
import { logger } from './logger'

const { api: apiUrl, token, retrievePath } = env.lotus
const retrieve_timeout = 30 * 60000 // 30 mins

export enum FundsStatus {
  funds_confirmed,
  error_insufficient_funds,
  error_price_changed,
}

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})

const callLotus = async (body, timeout = 10000) => {
  const { data } = await api.post('', body, { timeout: timeout })

  return data
}

export const version = () => {
  return callLotus({ jsonrpc: '2.0', method: 'Filecoin.Version', params: [], id: 0 })
}

export const getClientMinerQueryOffer = (miner, dataCid) => {
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
    retrieve_timeout,
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
  const BigNumber = require('bignumber.js')
  const interval = require('interval-promise')

  let requiredFundsBN = new BigNumber(requiredFunds)
  let fundsStatus = FundsStatus.error_insufficient_funds

  // iterate for 20 minutes, waiting 5 seconds before each iteration
  await interval(
    async (_iteration, stop) => {
      const balance = await walletBalance(wallet)
      if (balance) {
        let balanceBN = new BigNumber(balance.result)
        if (balanceBN.comparedTo(requiredFundsBN) == 1 || balanceBN.comparedTo(requiredFundsBN) == 0) {
          fundsStatus = FundsStatus.funds_confirmed
          stop()
        }
      }
    },
    5000,
    { iterations: iterations },
  )

  return fundsStatus
}

export const queryMinerOffer = async (dataCid, minerID): Promise<any> => {
  const queryOffer = await getClientMinerQueryOffer(minerID, dataCid)
  logger.log('Query Offer:', queryOffer)

  if (queryOffer.error || !queryOffer.result) {
    logger.error('ClientMinerQueryOffer:', queryOffer.error)

    return
  }

  return queryOffer.result
}

export const getCIDAvailability = async (dataCid, minerID): Promise<any> => {
  let result = { availability: false, wallet: null, price: null }

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

export const retrieve = async (dataCid: string, minerID: string, wallet: string): Promise<string> => {
  let filePath = null

  try {
    const queryOffer = await queryMinerOffer(dataCid, minerID)

    logger.log('queryOffer:', queryOffer)

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
      filePath = uniqueFilename(retrievePath, 'pr')

      const retrieveResult = await getClientRetrieve(retrievalOffer, filePath)

      logger.log('retrieve result: ', retrieveResult)

      if (retrieveResult.error) {
        filePath = undefined
        throw new Error(retrieveResult.error.message)
      }
    }
  } catch (err) {
    logger.error('Error retrieving file', err)
  }

  return filePath
}
