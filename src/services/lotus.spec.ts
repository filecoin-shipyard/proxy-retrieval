import {
  confirmFunds,
  FundsStatus,
  getClientMinerQueryOffer,
  retrieve,
  version,
  walletBalance,
  walletNew,
} from './lotus'

// CIDs
// bafk2bzacebhlhbcnhmvover42qq5bx773c522skieho6nhtbz7d2ow3f4sw24
// bafykbzacecdt3sxmqj2xi6ntatf4ikycu6korkyv3pd632zot64lah5oonftw

const mock = {
  cid: 'bafk2bzacebhlhbcnhmvover42qq5bx773c522skieho6nhtbz7d2ow3f4sw24',
  miner: 'f019243',

  wallet: 'f1zlclil7vvbhqx5h4wbfevpgc3amhmrtg46dhb7a',
  emptyWallet: 'f1crikx6lnjxwangz5azdkqmpqmj32twrrwr3ncuq',
  retrieveWallet: 'f1xgvqfhauw3r2cuhjp3n3ajlriwvt6m4lofoh2zy',

  requiredFunds: '1000000000000000000',
  notEnoughFunds: '1000000000000000001',
}

describe('services/lotus', () => {
  describe('getClientMinerQueryOffer', () => {
    it('returns the availability for a CID', async () => {
      const response = await getClientMinerQueryOffer(mock.miner, mock.cid)
      const { result, error } = response

      expect(error).toBeFalsy()
      expect(result.Err).toEqual('')
      expect(+result.MinPrice).toBeGreaterThanOrEqual(0)
    })
  })

  describe('confirmFunds', () => {
    it('checks required funds', async () => {
      const result = await confirmFunds(mock.wallet, mock.requiredFunds, 10)

      expect(result).toEqual(FundsStatus.FundsConfirmed)
    }, 60000)

    it('checks insufficient funds', async () => {
      const result = await confirmFunds(mock.wallet, mock.notEnoughFunds, 10)

      expect(result).toEqual(FundsStatus.ErrorInsufficientFunds)
    }, 60000)
  })

  describe('walletNew', () => {
    it('creates a new wallet', async () => {
      const wallet = await walletNew()

      expect(wallet.error && wallet.error.message).toBeFalsy()
      expect(wallet.result).toContain('f1')
    })
  })

  describe('walletBalance', () => {
    it('returns the wallet balance', async () => {
      const wallet = await walletBalance(mock.emptyWallet)

      expect(wallet.result).toEqual('0')
    })
  })

  describe('version', () => {
    it('returns Lotus API version', async () => {
      const ver = await version()

      expect(ver.result.Version).toBeTruthy()
    })
  })

  // Skip: requires to be ran in a machine with private keys
  // also takes 15 minutes or more to finish
  xdescribe('retrieve', () => {
    it(
      'returns a file',
      async () => {
        const outPath = `./test-result-${mock.cid}`
        const file = await retrieve(mock.cid, mock.miner, mock.retrieveWallet, outPath)

        expect(file).toBeTruthy()
      },
      1000 * 60 * 30,
    )
  })
})
