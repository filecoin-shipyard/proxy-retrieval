import * as knex from 'knex'
import * as path from 'path'
import { config } from './index'

export const database = {
  client: 'postgresql',
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  },
  migrations: {
    directory: path.resolve('../db/migrations'),
    tableName: 'knex_migrations',
  },
} as knex.Config
