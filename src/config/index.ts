import * as dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: +process.env.PORT || 3000,
  lotus: {
    api: process.env.LOTUS_API || 'http://3.236.16.245:1234/rpc/v0', // change to localhost
    token:
      process.env.LOTUS_TOKEN ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.fTZF8M_x5igkL281jLSbIODy9LqOyKjzC2o6EEy0ldQ',
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
}

export * from './database'
