import * as Knex from 'knex'

import { tables } from '../../config'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tables.clients, (table) => {
    table.integer('bytes_sent').defaultTo(0)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tables.clients, (table) => {
    table.dropColumn('bytes_sent')
  })
}
