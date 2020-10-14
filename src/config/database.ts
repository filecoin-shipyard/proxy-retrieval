import * as knex from 'knex'
import * as path from 'path'

import { env } from './env'

export const tables = {
  clients: 'clients',
}

export const database = {
  client: 'postgresql',
  connection: {
    host: env.db.host,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    port: env.db.port || 5432,
  },
  migrations: {
    directory: path.resolve('../db/migrations'),
    tableName: 'knex_migrations',
  },
} as knex.Config
