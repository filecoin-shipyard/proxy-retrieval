import * as knex from 'knex'
import { database, tables } from '../config'

import { insertClientType, updateStageType, updateFilePathType, getClientType } from './types'
const db = knex(database)

export const insertClient = async (args: insertClientType) => {
  try {
    return await db(tables.clients).insert(args)
  } catch (e) {
    console.error(e)
  }
}

export const updateClientStage = async (args: updateStageType) => {
  try {
    return await db(tables.clients).where('client_secret', args.clientSecret).update('stage', args.stage)
  } catch (e) {
    console.error(e)
  }
}

export const updateClientFilePath = async (args: updateFilePathType) => {
  try {
    return await db(tables.clients)
      .where('client_secret', args.clientSecret)
      .update('temp_file_path', args.tempFilePath)
  } catch (e) {
    console.error(e)
  }
}

export const getClientStage = async (args: getClientType) => {
  try {
    return await db(tables.clients)
      .select('stage')
      .where('client_secret', args.clientSecret)
      .andWhere('cid_requested', args.cid)
  } catch (e) {
    console.error(e)
  }
}

export const getClient = async (args: getClientType) => {
  try {
    return await db(tables.clients)
      .where('client_secret', args.clientSecret)
      .andWhere('cid_requested', args.cid)
      .select()
  } catch (e) {
    console.error(e)
  }
}
