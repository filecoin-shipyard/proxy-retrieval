import * as Knex from 'knex'

const tables = {
  clients: 'clients',
}

export async function up(knex: Knex) {
  return knex.schema.createTable(tables.clients, (table) => {
    table.increments('id').primary()
    table.string('client_secret', 128).notNullable()
    table.string('cid_requested', 128).notNullable()
    table.string('wallet_address', 128).notNullable()
    table.string('price_attofil', 128).notNullable()
    table.string('stage', 128).notNullable().defaultTo('RECEIVED_CID')
    table.string('temp_file_path', 128)
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTableIfExists(tables.clients)
}
