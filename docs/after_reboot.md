### Steps to start app after machine was rebooted

```
First restart Lotus.
$ rm -rf ~/.lotus/datastore/chain/
$ nohup lotus daemon --import-snapshot https://fil-chain-snapshots-fallback.s3.amazonaws.com/mainnet/minimal_finality_stateroots_latest.car > ~/lotus-daemon.log &

Wait for chain state to be downloaded.
$ tail -f ~/lotus-daemon.log

Wait for Lotus to sync remaining blocks
$ lotus sync status

Start by navigating to your project directory.
$ cd proxy-retrieval/

To start your app with pm2 use this command.
$ pm2 start npm --name rerieval  -- start

```
