import * as Knex from 'knex'

import { tables } from '../../config'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tables.clients, (table) => {
    table.text('client_token').notNullable().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tables.clients, (table) => {
    table.string('client_token', 256).notNullable().alter()
  })
}
