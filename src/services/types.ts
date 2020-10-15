export type insertClientType = {
  client_secret: string
  cid_requested: string
  wallet_address: string
  price_attofil: string
  wallet_private_key: string
}

export type updateStageType = {
  stage: string
  clientSecret: string
}

export type updateFilePathType = {
  tempFilePath: string
  clientSecret: string
}

export type getClientType = {
  clientSecret: string
  cid: string
}
