import * as crypto from 'crypto'

export const sha256 = (message, encoding: crypto.HexBase64Latin1Encoding = 'hex') => {
  const hash = crypto.createHash('sha256')

  hash.update(message)

  return hash.digest(encoding)
}
