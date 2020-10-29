import * as crypto from 'crypto'
import * as fs from 'fs'

export const sha256File = (path) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    const input = fs.createReadStream(path)

    input.on('error', reject)

    input.on('data', (chunk) => {
      hash.update(chunk)
    })

    input.on('close', () => {
      resolve(hash.digest('hex'))
    })
  })
}
