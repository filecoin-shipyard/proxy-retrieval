export const config = {
  port: +process.env.PORT || 3000,
  lotus: {
    api: process.env.LOTUS_API || 'http://ec2-3-137-141-6.us-east-2.compute.amazonaws.com:1234/rpc/v0', // change to localhost
    token:
      process.env.LOTUS_TOKEN ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.lbKNdZrj1rPbPaeCOBANmMRL7m39SbpfNFuX7qmFcCg',
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 5432,
  },
}
