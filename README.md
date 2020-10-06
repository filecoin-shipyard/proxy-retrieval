# Retrieval Proxy Server

The Retrieval Proxy (RP) server is a simple method of allowing a browser node to retrieve from a stroage miner indirectly.

When the browser wishes to retrieve a file from a Storage Miner, it opens a websockets connection to the RP server.  The browser sends the CID it wants and FIL to fund the retrieval to a wallet created on the RP server.  The RP server, which is running a full Lotus daemon instance, then does the requested retrieval and sends the data back to the browser.

![Diagram of Browser and Retrieval Proxy Working Together](/mgoelzer/proxy-retrieval/blob/master/docs/RetrievalProxyDiagram.png?raw=true)

## API

The API is described in this Google Doc:  

As we finalize the first version of the API, that document will be brought into this repo as markdown.

## Contributing

This repo contains all information needed to run an RP server yourself.  See the `docs/` directory.

We welcome contributions in the form of issues and PRs to this repo.  We also have a daily standup at 3pm UTC.  Email [mike@protocol.ai](mike@protocol.ai) if you'd like to join.  Lurkers welcome.

## License

Copyright Filecoin Project, 2020.  MIT License.
