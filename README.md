# Cartesi Explorer

This web application shows several informations about Cartesi Proof of Stake:

- node public address
- node balance
- current node owner
- action to claim a node through metamask
- action to release a node from the current owner

## Running

This is a [Next.js](https://nextjs.org) application which uses smart contracts deployed by the [solidity-util](https://github.com/cartesi/solidity-util) project.
In order to run the application you need to:

- run `solidity-util` local node with the contracts deployed
- deploy `token` contracts to the local network using buidler
- deploy `pos-dlib` smart contracts to the local network using buidler
- yarn link this project to `solidity-util`, `pos-dlib`, `token` projects, so it uses the same build files with contract information
- run `yarn run postinstall` to generate the contract classes (or `yarn install` also works)
- `yarn dev`
- open [http://localhost:3000](http://localhost:3000)

