import * as knex from 'knex'
import * as knexStringcase from 'knex-stringcase'

import { database } from '../config'

const options = knexStringcase(database)

export const db = knex(options)
