import { getClientMinerQueryOffer } from './lotus'

const cid = 'bafk2bzaced7r5ss6665h7d4s4qupduojmiuvmhqoiknmun5mawa3xj2s3lqmq'
const miner = 'f033048'

describe('services/lotus', () => {
  describe('getClientMinerQueryOffer', () => {
    it('returns the availability for a CID', async () => {
      const { result } = await getClientMinerQueryOffer(miner, cid)

      expect(result.Err).toEqual('')
      expect(+result.MinPrice).toBeGreaterThanOrEqual(0)
      // ...
    })
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
