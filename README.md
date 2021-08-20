# Retrieval Proxy Server

## Status

This repository is in a **frozen** state. It is not being maintained or kept in sync with the tools and libraries it builds on. Even though work on this repository has been **shelved**, anyone interested in updating or maintaining this project should express their interest on one Filecoin community conversation mediums: <https://github.com/filecoin-project/community#join-the-community>.

---

The Retrieval Proxy (RP) server is a simple method of allowing a browser node to retrieve from a stroage miner indirectly.

When the browser wishes to retrieve a file from a Storage Miner, it opens a websockets connection to the RP server.  The browser sends the CID it wants and FIL to fund the retrieval to a wallet created on the RP server.  The RP server, which is running a full Lotus daemon instance, then does the requested retrieval and sends the data back to the browser.

![Diagram of Browser and Retrieval Proxy Working Together](docs/RetrievalProxyDiagram.png?raw=true)

## Retrieval Proxy Protocol

The draft protocol is described in this [Protocol Design Google Doc](https://docs.google.com/document/d/1swBHR9xaFVH5l26wgIRw6pqUlQbYBWeLDLgka-SmC8k/edit). 

As we finalize the first version of the API, that document will be brought into this repo as markdown.

## Contributing

This repo contains all information needed to run an RP server yourself.  See the `docs/` directory.

We welcome contributions in the form of issues and PRs to this repo.  We also have a daily standup at 3pm UTC.  Email [mike@protocol.ai](mike@protocol.ai) or contact `@mike - pl` on [Filecoin Slack](https://filecoin.io/slack) if you'd like to join.  Curious lurkers and serious contributors are equally welcome!

## License

Copyright Filecoin Project, 2020.  MIT License.
