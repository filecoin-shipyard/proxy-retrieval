import { Pool } from 'pg'
import { config } from '../config'

const pool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
})

export const initDB = async () => {
  try {
    const poolClient = await pool.connect()

    await poolClient.query(
      "\
        CREATE TABLE IF NOT EXISTS clients\
        (\
            id SERIAL PRIMARY KEY NOT NULL,\
            client_secret varchar(100) NOT NULL,\
            cid_requested varchar(100) NOT NULL,\
            wallet_address varchar(100) NOT NULL,\
            price_attofil varchar(100) NOT NULL,\
            stage varchar(50) NOT NULL DEFAULT 'RECEIVED_CID',\
            temp_file_path varchar(50), \
            date timestamptz NOT NULL DEFAULT NOW() \
        )",
    )

    return poolClient.release()
  } catch (e) {
    console.error(e)
  }
}

export const insertClient = async (clientSecret: string, cidRequested: string, walletAddress: string, priceAttofil) => {
  try {
    const poolClient = await pool.connect()

    await poolClient.query(`\
                INSERT INTO clients (client_secret, cid_requested, wallet_address, price_attofil) \
                VALUES ('${clientSecret}', '${cidRequested}', '${walletAddress}', '${priceAttofil}')\
                `)

    return poolClient.release()
  } catch (e) {
    console.error(e)
  }
}

export const updateClientStage = async (stage: string, clientSecret: string) => {
  if (!clientSecret) {
    throw 'Please provide a client secret!'
  }

  try {
    const poolClient = await pool.connect()

    await poolClient.query(`\
             UPDATE clients \\
             SET stage = ${stage} \\
             WHERE client_secret = '${clientSecret}';\\
                `)

    return poolClient.release()
  } catch (e) {
    console.error(e)
  }
}

export const updateClientFilePath = async (tempFilePath: string, clientSecret: string) => {
  if (!clientSecret) {
    throw 'Please provide a client secret!'
  }

  try {
    const poolClient = await pool.connect()

    await poolClient.query(`\
             UPDATE clients \\
             SET temp_file_path = ${tempFilePath} \\
             WHERE client_secret = '${clientSecret}';\\
                `)

    return poolClient.release()
  } catch (e) {
    console.error(e)
  }
}

export const getClient = async (clientSecret: string, cid: string) => {
  if (!clientSecret && !cid) {
    throw 'Please provide a client secret and cid!'
  }

  try {
    const poolClient = await pool.connect()
    const client = await poolClient.query(
      `SELECT * FROM clients WHERE client_secret = '${clientSecret}' AND cid_requested = '${cid}'`,
    )
    poolClient.release()

    return client.rows
  } catch (e) {
    console.error(e)
  }
}