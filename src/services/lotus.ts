import axios from 'axios'

import { config } from '../config'

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

export const getClientMinerQueryOffer = (miner, dataCid) => {
  return callLotus({
    jsonrpc: '2.0',
    method: 'Filecoin.ClientMinerQueryOffer',
    params: [miner, { '/': dataCid }, null],
    id: 0,
  })
}

export const getClientRetrieve = (retrievalOffer, outFile) => {
  return callLotus({
    jsonrpc: '2.0',
    method: 'Filecoin.ClientRetrieve',
    params: [retrievalOffer, { Path: outFile, IsCAR: false }],
    id: 0,
  })
}

export const walletNew = () => {
  const kTrashPrefix = 1 // used for testnet

  return callLotus({ jsonrpc: '2.0', method: 'Filecoin.WalletNew', params: [kTrashPrefix], id: 0 })
}

export const walletBalance = (wallet) => {
  return callLotus({ jsonrpc: '2.0', method: 'Filecoin.WalletBalance', params: [wallet], id: 0 })
}

export const version = () => {
  return callLotus({ jsonrpc: '2.0', method: 'Filecoin.Version', params: [], id: 0 })
}
