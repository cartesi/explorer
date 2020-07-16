# Descartes Console

This web application shows several informations about a Descartes Node:

- node public address
- node balance
- current node owner
- action to claim a node through metamask
- action to release a node from the current owner

## Running

This is a React application which uses smart contracts deployed by the `solidity-util` project.
In order to run the application you need to:

- run a local ganache
- deploy `solidity-util` contracts
- yarn link this project to `solidity-util` project, so it uses the same build files with contract information
- `yarn start`
- open [http://localhost:3000](http://localhost:3000)

