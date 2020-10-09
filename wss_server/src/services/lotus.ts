import { config } from '../config'

let api = config.lotus.api
let token = config.lotus.token

function LotusCmd(body) {
  return new Promise(function (resolve, reject) {
    const axios = require('axios')
    axios
      .post(api, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const ClientMinerQueryOffer = (miner, dataCid) => {
  return LotusCmd(
    JSON.stringify({
      jsonrpc: '2.0',
      method: 'Filecoin.ClientMinerQueryOffer',
      params: [miner, { '/': dataCid }, null],
      id: 0,
    }),
  )
}

export const ClientRetrieve = (retrievalOffer, outFile) => {
  return LotusCmd(
    JSON.stringify({
      jsonrpc: '2.0',
      method: 'Filecoin.ClientRetrieve',
      params: [retrievalOffer, { Path: outFile, IsCAR: false }],
      id: 0,
    }),
  )
}

export const WalletNew = () => {
  return LotusCmd(JSON.stringify({ jsonrpc: '2.0', method: 'Filecoin.WalletNew', params: [1], id: 0 })) // 1 = KTrashPrefix used for testnet
}

export const WalletBalance = (wallet) => {
  return LotusCmd(JSON.stringify({ jsonrpc: '2.0', method: 'Filecoin.WalletBalance', params: [wallet], id: 0 }))
}

export const Version = () => {
  return LotusCmd(JSON.stringify({ jsonrpc: '2.0', method: 'Filecoin.Version', params: [], id: 0 }))
}
