import * as knex from 'knex'
import { database } from '../config'

import { insertClientType, updateStageType, updateFilePathType, getClientType } from './types'
const db = knex(database)

export const insertClient = async (args: insertClientType) => {
  try {
    return await db('clients').insert(args)
  } catch (e) {
    console.error(e)
  }
}

export const updateClientStage = async (args: updateStageType) => {
  try {
    return await knex('clients').where('client_secret', args.clientSecret).update('stage', args.stage)
  } catch (e) {
    console.error(e)
  }
}

export const updateClientFilePath = async (args: updateFilePathType) => {
  try {
    return await knex('clients').where('client_secret', args.clientSecret).update('temp_file_path', args.tempFilePath)
  } catch (e) {
    console.error(e)
  }
}

export const getClient = async (arg: getClientType) => {
  try {
    return await knex('clients').where('client_secret', arg.clientSecret).andWhere('cid_requested', arg.cid).select()
  } catch (e) {
    console.error(e)
  }
}
