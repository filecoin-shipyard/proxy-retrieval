import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config()
dotenv.config({ path: path.join(__dirname, '../../.env') })

interface Environment {
  isProduction: boolean
  isTest: boolean
  isDevelopment: boolean

  rootDir: string

  port: number

  lotus: {
    api: string
    token: string
    retrievePath: string
    retrievePathLocal: string
  }

  db: {
    host: string
    user: string
    password: string
    database: string
    port: number
  }

  token: {
    secret: string
    expiresIn: string
  }
}

export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',

  rootDir: path.join(path.resolve(__dirname), '../..'),

  port: +process.env.PORT || 3000,

  lotus: {
    api: process.env.LOTUS_API,
    token: process.env.LOTUS_TOKEN,
    retrievePath: process.env.LOTUS_RETRIEVE,

    /**
     * Can be used to overwrite the local retrieve path.
     */
    retrievePathLocal: process.env.LOTUS_RETRIEVE_LOCAL || process.env.LOTUS_RETRIEVE,
  },

  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: +process.env.DB_PORT || 5432,
  },

  token: {
    secret: process.env.TOKEN_SECRET,
    expiresIn: process.env.TOKEN_EXPIRES_IN || '7 days',
  },
} as Environment & { [key: string]: any }
