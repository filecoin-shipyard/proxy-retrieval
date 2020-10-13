import axios from 'axios'
import { Md5 } from 'ts-md5/dist/md5'

import { config } from '../config'
import { getClient, insertClient } from './database'

const { api: apiUrl, token } = config.lotus

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})

const callLotus = async (body) => {
  const { data } = await api.post('', body)

  return data
}

export const getCidAvailability = async (miner, dataCid, clientWallet) => {
  const clientSecret = Md5.hashStr(clientWallet).toString()
  const clientData = await getClient(clientSecret, dataCid)

  try {
    if (clientData.length > 0) {
      return clientData
    } else {
      const wallet = await walletNew()
      await insertClient(clientSecret, dataCid, wallet.result)

      const queryMiner = await getClientMinerQueryOffer(miner, dataCid)

      return { wallet: wallet.result, query: queryMiner.result }
    }
  } catch (e) {
    return e
  }
}

export const getClientMinerQueryOffer = (miner, dataCid) => {
  return callLotus(
    JSON.stringify({
      jsonrpc: '2.0',
      method: 'Filecoin.ClientMinerQueryOffer',
      params: [miner, { '/': dataCid }, null],
      id: 0,
    }),
  )
}

export const getClientRetrieve = (retrievalOffer, outFile) => {
  return callLotus(
    JSON.stringify({
      jsonrpc: '2.0',
      method: 'Filecoin.ClientRetrieve',
      params: [retrievalOffer, { Path: outFile, IsCAR: false }],
      id: 0,
    }),
  )
}

export const walletNew = () => {
  const kTrashPrefix = 1 // used for testnet

  return callLotus(JSON.stringify({ jsonrpc: '2.0', method: 'Filecoin.WalletNew', params: [kTrashPrefix], id: 0 }))
}

export const walletBalance = (wallet) => {
  return callLotus(JSON.stringify({ jsonrpc: '2.0', method: 'Filecoin.WalletBalance', params: [wallet], id: 0 }))
}

export const version = () => {
  return callLotus(JSON.stringify({ jsonrpc: '2.0', method: 'Filecoin.Version', params: [], id: 0 }))
}
