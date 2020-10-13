import * as dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: +process.env.PORT || 3000,
  lotus: {
    api: process.env.LOTUS_API,
    token: process.env.LOTUS_TOKEN,
  },
}
