import * as Knex from 'knex'
import { tables } from '../../config'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tables.clients, (table) => {
    table.string('client_secret', 256).notNullable().alter()
    table.string('wallet_private_key', 128).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tables.clients, (table) => {
    table.string('client_secret', 128).notNullable().alter()
    table.dropColumn('wallet_private_key')
  })
}
