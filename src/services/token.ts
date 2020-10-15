import * as jwt from 'jsonwebtoken'

import { env } from '../config'

export interface ClientToken {
  clientToken: string
}

export const validateAndDecodeToken = ({ clientToken }: ClientToken) => {
  return jwt.verify(clientToken, env.token.secret) as Object
}

export const createToken = (message) => {
  return jwt.sign(message, env.token.secret, { expiresIn: env.token.expiresIn })
}
