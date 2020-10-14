import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config()
dotenv.config({ path: path.join(__dirname, '../../.env') })

interface Environment {
  isProduction: boolean
  isTest: boolean
  isDevelopment: boolean

  port: number

  lotus: {
    api: string
    token: string
  }

  db: {
    host: string
    user: string
    password: string
    database: string
  }
}

export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',

  port: +process.env.PORT || 3000,

  lotus: {
    api: process.env.LOTUS_API,
    token: process.env.LOTUS_TOKEN,
  },

  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
} as Environment & { [key: string]: any }
