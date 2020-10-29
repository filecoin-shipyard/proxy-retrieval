import * as Knex from 'knex'

import { tables } from '../../config'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tables.clients, (table) => {
    table.string('temp_file_checksum', 128)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tables.clients, (table) => {
    table.dropColumn('temp_file_checksum')
  })
}
