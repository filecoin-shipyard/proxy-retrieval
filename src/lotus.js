'use strict';

const config = require('./config');

let api = config.lotus.api;
let token = config.lotus.token;

function LotusCmd(body) {
    return new Promise(function (resolve, reject) {
        const axios = require('axios');
        axios.post(api, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        });
    })
}

function ClientMinerQueryOffer(miner, dataCid) {
    return LotusCmd(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.ClientMinerQueryOffer", "params": [miner, {"/":dataCid}, null], "id": 0 }));
}

function ClientRetrieve(retrievalOffer, outFile) {
    return LotusCmd(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.ClientRetrieve", "params": [retrievalOffer,{"Path":outFile,"IsCAR":false}], "id": 0 }));
}

function WalletNew() {
    return LotusCmd(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.WalletNew", "params": [1], "id": 0 }));  // 1 = KTrashPrefix used for testnet
}

function WalletBalance(wallet) {
    return LotusCmd(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.WalletBalance", "params": [wallet], "id": 0 }));
}

function Version() {
    return LotusCmd(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.Version", "params": [], "id": 0 }));
}


module.exports = {
    ClientMinerQueryOffer,
    ClientRetrieve,
    WalletNew,
    Version,
    WalletBalance
};

