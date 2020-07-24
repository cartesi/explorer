# Descartes Console

This web application shows several informations about a Descartes Node:

- node public address
- node balance
- current node owner
- action to claim a node through metamask
- action to release a node from the current owner

## Running

This is a [Next.js](https://nextjs.org) application which uses smart contracts deployed by the [solidity-util](https://github.com/cartesi/solidity-util) project.
In order to run the application you need to:

- run `solidity-util` local node with the contracts deployed
- yarn link this project to `solidity-util` project, so it uses the same build files with contract information
- `yarn dev`
- open [http://localhost:3000](http://localhost:3000)

