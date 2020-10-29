import * as Knex from 'knex'

import { tables } from '../../config'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tables.clients, (table) => {
    table.string('miner_requested', 128)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tables.clients, (table) => {
    table.dropColumn('miner_requested')
  })
}
