import { tables } from '../config'
import { Clients } from '../models/clients'
import { db } from './database'

enum Stages {
  ReceivedCid = 'RECEIVED_CID',
  FundsConfirmed = 'FUNDS_CONFIRMED',
}

export const get = async ({ clientToken }: Partial<Clients>) => {
  return (await db(tables.clients).where({ clientToken }).first()) as Clients
}

export const registerClient = async (clientInfo: Clients) => {
  return await db(tables.clients).insert(clientInfo)
}

export const confirmFunds = async ({ clientToken }) => {
  return await db(tables.clients).where({ clientToken }).update({
    stage: Stages.FundsConfirmed,
  })
}

export const confirmFile = async ({ clientToken, tempFilePath }) => {
  return await db(tables.clients).where({ clientToken }).update({
    tempFilePath,
  })
}

export const updateBytesSent = async ({ clientToken, bytesSent }) => {
  return await db(tables.clients).where({ clientToken }).update({
    bytesSent,
  })
}

// export const insertClient = async (args: insertClientType) => {
//   try {
//     return await db(tables.clients).insert(args)
//   } catch (e) {
//     console.error(e)
//   }
// }

// export const updateClientStage = async (args: updateStageType) => {
//   try {
//     return await db(tables.clients).where('client_secret', args.clientSecret).update('stage', args.stage)
//   } catch (e) {
//     console.error(e)
//   }
// }

// export const updateClientFilePath = async (args: updateFilePathType) => {
//   try {
//     return await db(tables.clients)
//       .where('client_secret', args.clientSecret)
//       .update('temp_file_path', args.tempFilePath)
//   } catch (e) {
//     console.error(e)
//   }
// }

// export const getClientStage = async (args: getClientType) => {
//   try {
//     return await db(tables.clients)
//       .select('stage')
//       .where('client_secret', args.clientSecret)
//       .andWhere('cid_requested', args.cid)
//   } catch (e) {
//     console.error(e)
//   }
// }

// export const getClient = async (args: getClientType) => {
//   try {
//     return await db(tables.clients)
//       .where('client_secret', args.clientSecret)
//       .andWhere('cid_requested', args.cid)
//       .select()
//   } catch (e) {
//     console.error(e)
//   }
// }
