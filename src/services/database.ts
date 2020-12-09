import * as knex from 'knex'
import * as knexStringcase from 'knex-stringcase'
import * as path from 'path'

import { database } from '../config'
import { logger } from './logger'

export let db: knex<any, unknown[]>

const fixPaths = (database) => {
  return {
    ...database,
    migrations: {
      ...database.migrations,
      directory: path.join(__dirname, '../db/migrations'),
    },
  }
}

export const startDb = async () => {
  logger.log('Starting database connection...')

  if (!db) {
    const databaseSettings = fixPaths(database)

    const options = knexStringcase(databaseSettings)
    db = knex(options)

    logger.log('Running migrations...')

    try {
      await db.migrate.latest()
    } catch (err) {
      logger.error('Failed to run migrations')
      return process.exit(1)
    }

    logger.log('Done running migrations!')
  }

  return db
}
