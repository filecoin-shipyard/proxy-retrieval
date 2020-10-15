import axios from 'axios'

import { env } from '../config'

var uniqueFilename = require('unique-filename')

const { api: apiUrl, token, retrievePath } = env.lotus

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})

const callLotus = async (body) => {
  const { data } = await api.post('', body, { timeout: 10000 })

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

// Generate a Secp256k1 wallet
export const walletNew = () => {
  const KTrashPrefix = 1
  return callLotus({ jsonrpc: '2.0', method: 'Filecoin.WalletNew', params: [KTrashPrefix], id: 0 })
}

export const walletBalance = (wallet) => {
  return callLotus({ jsonrpc: '2.0', method: 'Filecoin.WalletBalance', params: [wallet], id: 0 })
}

export const version = () => {
  return callLotus({ jsonrpc: '2.0', method: 'Filecoin.Version', params: [], id: 0 })
}

export const createWallet = async (): Promise<string> => {
  const newWallet = await walletNew()
  const wallet = newWallet.result
  console.log('new wallet: ' + newWallet.result)

  return wallet.result
}

export const queryMinerOffer = async (dataCid, minerID): Promise<any> => {
  const queryOffer = await getClientMinerQueryOffer(minerID, dataCid)
  console.log(JSON.stringify(queryOffer))
  if (queryOffer.error || !queryOffer.result) {
    console.error('ClientMinerQueryOffer:' + queryOffer.error)
    return null
  }

  return queryOffer.result
}

export const getCIDAvailability = async (dataCid, minerID): Promise<any> => {
  let result = { availability: false, wallet: null, price: null }

  try {
    const ver = await version()
    console.log(ver)

    const queryOffer = await queryMinerOffer(dataCid, minerID)
    if (queryOffer) {
      const wallet = await createWallet()
      result.availability = true
      result.wallet = wallet
      result.price = queryOffer.MinPrice + queryOffer.UnsealPrice
    }
  } catch (err) {
    console.log('Error: ' + err.message)
  }

  return result
}

export const retrieve = async (dataCid, minerID, wallet): Promise<string> => {
  let filePath = ''
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
      filePath = uniqueFilename(retrievePath, 'pr')
      const retrieveResult = await getClientRetrieve(retrievalOffer, filePath)
      console.log('retrieve result: ', retrieveResult)
    }
  } catch (err) {
    console.log('Error: ' + err.message)
  }

  return filePath
}

// retrieve sample:
const wallet = createWallet()
retrieve('bafk2bzaced7r5ss6665h7d4s4qupduojmiuvmhqoiknmun5mawa3xj2s3lqmq', 'f033048', wallet)
