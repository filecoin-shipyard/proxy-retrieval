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
  const kTrashPrefix = 1 // testnet

  return callLotus({ jsonrpc: '2.0', method: 'Filecoin.WalletNew', params: [kTrashPrefix], id: 0 })
}

export const walletBalance = (wallet) => {
  return callLotus({ jsonrpc: '2.0', method: 'Filecoin.WalletBalance', params: [wallet], id: 0 })
}

export const version = () => {
  return callLotus({ jsonrpc: '2.0', method: 'Filecoin.Version', params: [], id: 0 })
}

export const retrieve = async (dataCid, minerID) => {
  try {
    const ver = await version()
    console.log(ver)

    const newWallet = await walletNew()
    const wallet = newWallet.result
    console.log('new wallet: ' + newWallet.result)

    // TODO: wait for funds

    const queryOffer = await getClientMinerQueryOffer(minerID, dataCid)
    console.log(JSON.stringify(queryOffer))
    if (queryOffer.error) {
      console.error('ClientMinerQueryOffer:' + queryOffer.error)
      return
    }
    const queryResult = queryOffer.result
    if (queryOffer.result) {
      const retrievalOffer = {
        Root: queryResult.Root,
        Piece: null,
        Size: queryResult.Size,
        Total: queryResult.MinPrice,
        UnsealPrice: queryResult.UnsealPrice,
        PaymentInterval: queryResult.PaymentInterval,
        PaymentIntervalIncrease: queryResult.PaymentIntervalIncrease,
        Client: wallet,
        Miner: queryResult.Miner,
        MinerPeer: queryResult.MinerPeer,
      }
      // TODO: generate unique names for files
      const retrieveResult = await getClientRetrieve(retrievalOffer, '/root/out_r124.data')
      console.log('retrieve result: ', retrieveResult)
    }

    // TODO: delete wallet
  } catch (err) {
    console.log('Error: ' + err.message)
  }
}

// retrieve sample:
// retrieve('bafk2bzacebbhqzi4y546h7gjbduauzha6z33ltequ7hpbvywnttc57xrwcit2', 't01352');
