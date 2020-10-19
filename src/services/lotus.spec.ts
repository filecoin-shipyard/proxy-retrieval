import { getClientMinerQueryOffer, confirmFunds, FundsStatus } from './lotus'

const cid = 'bafk2bzaced7r5ss6665h7d4s4qupduojmiuvmhqoiknmun5mawa3xj2s3lqmq'
const miner = 'f033048'
const wallet = 'f1zlclil7vvbhqx5h4wbfevpgc3amhmrtg46dhb7a'
const requiredFunds = '1000000000000000000'
const notEnoughFunds = '1000000000000000001'

describe('services/lotus', () => {
  describe('getClientMinerQueryOffer', () => {
    it('returns the availability for a CID', async () => {
      const { result } = await getClientMinerQueryOffer(miner, cid)

      expect(result.Err).toEqual('')
      expect(+result.MinPrice).toBeGreaterThanOrEqual(0)
      // ...
    })
  })

  describe('confirmFunds', () => {
    it('checks required funds', async () => {
      const result = await confirmFunds(wallet, requiredFunds)

      expect(result).toEqual(FundsStatus.funds_confirmed)
    }, 60000)

    it('checks insufficient funds', async () => {
      const result = await confirmFunds(wallet, notEnoughFunds)

      expect(result).toEqual(FundsStatus.error_insufficient_funds)
    }, 60000)
  })

  // describe('getClientRetrieve', () => {
  //   it('returns the client retrieve', () => {
  //     expect(false).toBeTruthy()
  //   })
  // })

  // describe('walletNew', () => {
  //   it('creates a new wallet', () => {
  //     expect(false).toBeTruthy()
  //   })
  // })

  // describe('walletBalance', () => {
  //   it('returns the wallet balance', () => {
  //     expect(false).toBeTruthy()
  //   })
  // })

  // describe('version', () => {
  //   it('returns Lotus API version', () => {
  //     expect(false).toBeTruthy()
  //   })
  // })

  // describe('retrieve', () => {
  //   it('returns a file', () => {
  //     expect(false).toBeTruthy()
  //   })
  // })
})
