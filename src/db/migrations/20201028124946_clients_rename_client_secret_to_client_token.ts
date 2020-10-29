import * as Knex from 'knex'
import { tables } from '../../config'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tables.clients, (table) => {
    table.renameColumn('client_secret', 'client_token')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tables.clients, (table) => {
    table.renameColumn('client_token', 'client_secret')
  })
}
