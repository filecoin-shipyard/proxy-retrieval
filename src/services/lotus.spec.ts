import {
  getClientMinerQueryOffer,
  confirmFunds,
  FundsStatus,
  walletNew,
  walletBalance,
  version,
  retrieve,
} from './lotus'

const cid = 'bafk2bzaced7r5ss6665h7d4s4qupduojmiuvmhqoiknmun5mawa3xj2s3lqmq'
const miner = 'f033048'
const wallet = 'f1zlclil7vvbhqx5h4wbfevpgc3amhmrtg46dhb7a'
const empty_wallet = 'f1crikx6lnjxwangz5azdkqmpqmj32twrrwr3ncuq'
const retrieve_wallet = 'f1xgvqfhauw3r2cuhjp3n3ajlriwvt6m4lofoh2zy'
const dataCid = 'bafk2bzaced7r5ss6665h7d4s4qupduojmiuvmhqoiknmun5mawa3xj2s3lqmq'
const minerID = 'f033048'
const requiredFunds = '1000000000000000000'
const notEnoughFunds = '1000000000000000001'

describe('services/lotus', () => {
  describe('getClientMinerQueryOffer', () => {
    it('returns the availability for a CID', async () => {
      const { result } = await getClientMinerQueryOffer(miner, cid)

      expect(result.Err).toEqual('')
      expect(+result.MinPrice).toBeGreaterThanOrEqual(0)
    })
  })

  describe('confirmFunds', () => {
    it('checks required funds', async () => {
      const result = await confirmFunds(wallet, requiredFunds, 10)

      expect(result).toEqual(FundsStatus.funds_confirmed)
    }, 60000)

    it('checks insufficient funds', async () => {
      const result = await confirmFunds(wallet, notEnoughFunds, 10)

      expect(result).toEqual(FundsStatus.error_insufficient_funds)
    }, 60000)
  })

  describe('walletNew', () => {
    it('creates a new wallet', async () => {
      const wallet = await walletNew()

      expect(wallet.result).toContain('f1')
    })
  })

  describe('walletBalance', () => {
    it('returns the wallet balance', async () => {
      const wallet = await walletBalance(empty_wallet)

      expect(wallet.result).toEqual('0')
    })
  })

  describe('version', () => {
    it('returns Lotus API version', async () => {
      const ver = await version()

      expect(ver.result.Version).not.toBeNull()
    })
  })

  describe('retrieve', () => {
    it('returns a file', async () => {
      const file = await retrieve(dataCid, minerID, retrieve_wallet)

      expect(file).not.toBeNull()
    })
  })
})
