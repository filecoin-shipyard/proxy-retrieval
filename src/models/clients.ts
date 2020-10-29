import { Entity } from './entity'

export interface Clients extends Entity {
  clientToken: string
  cidRequested: string
  minerRequested: string
  walletAddress: string
  priceAttofil: string
  stage?: string
  tempFilePath?: string
  tempFileChecksum?: string
  walletPrivateKey: string
  bytesSent?: number
}
