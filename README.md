# Cartesi Staking Explorer

This web application shows several informations about Cartesi Proof of Stake:

- node public address
- node balance
- current node owner
- action to claim a node through metamask
- action to release a node from the current owner

## Toolchain

This project pins its toolchain, and CI uses the same versions:

- **Node.js 24.21.0** (Active LTS)
- **pnpm 11.27.1**, declared in `packageManager`

pnpm is activated through Corepack, which ships with Node.js 24:

```
$ corepack enable
$ pnpm --version   # 11.27.1
```

> Corepack is still flagged Experimental in Node.js 24 and is **not** distributed
> with Node.js 25 or newer. When this project moves past Node.js 24, install pnpm
> directly instead (e.g. `npm install -g pnpm@11.27.1`).

## Package management

Dependency installs are governed by `pnpm-workspace.yaml`. Install with:

```
$ pnpm install --frozen-lockfile
```

The following supply-chain protections are enabled:

- `allowBuilds` — dependency install scripts are **denied unless explicitly
  listed**. When a new dependency needs to run a build script, pnpm reports it
  and the package has to be added here deliberately.
- `strictDepBuilds: true` — the install fails rather than silently skipping a
  dependency whose build script has not been reviewed.
- `blockExoticSubdeps: true` — transitive dependencies may not be pulled from
  git repositories or tarball URLs, only from the registry.
- `minimumReleaseAge: 10080` — a newly published version must be at least
  7 days old before it can be resolved, which blunts hijacked-release attacks.
- `trustPolicy: no-downgrade` — a package whose trust level drops relative to
  its previous releases fails the install.

`overrides` is used to pin transitive dependencies away from vulnerable or
non-registry sources.

## Running locally

This is a [Next.js](https://nextjs.org) application which uses smart contracts deployed by the [pos-dlib](https://github.com/cartesi/pos-dlib) and [staking-pool](https://github.com/cartesi/staking-pool) projects.
In order to run the application locally you need to:

1. Run a localhost hardhat node with all contracts deployed
2. Run a local graph node reading from the local hardhat node and deploy the subgraph
3. Run the application
4. Open application in browser and switch to a local network in MetaMask

### Running a local hardhat node

This can be done from the [staking-pool](https://github.com/cartesi/staking-pool) project by running:

```
$ cd staking-pool
$ yarn start --export ../explorer/src/services/contracts/localhost.json
```

This will run a local hardhat node running at http://127.0.0.1:8545/ and deploy all smart contracts.
Among the contracts are:

- CartesiToken: the CTSI token contract. Minter is the first account, and holds 1B tokens initially.
- StakingImpl: the staking contract.
- WorkerManagerAuthManagerImpl: used to hire worker nodes.
- PoS: proof of stake smart contract, holds the chains. Starts with no chain created.
- StakingPoolFactoryImpl: factory of new staking pools.

### Running a local graph node

The application uses a subgraph powered by thegraph to consolidate blockchain information and serve using a GraphQL endpoint.

- Clone the graph node from [GitHub](git@github.com:graphprotocol/graph-node.git).
- Copy the file `docker/docker-compose.yml` to `docker/docker-compose-localhost.yml`
- Modify line [20](https://github.com/graphprotocol/graph-node/blob/9e2e5e6a15406c312b686cb1d00b198ac7e45445/docker/docker-compose.yml#L20) to `ethereum: 'localhost:http://host.docker.internal:8545/'`
- Modify line [27](https://github.com/graphprotocol/graph-node/blob/9e2e5e6a15406c312b686cb1d00b198ac7e45445/docker/docker-compose.yml#L27) to `./data_localhost/ipfs:/data/ipfs`
- Modify line [38](https://github.com/graphprotocol/graph-node/blob/9e2e5e6a15406c312b686cb1d00b198ac7e45445/docker/docker-compose.yml#L38) to `./data_localhost/postgres:/var/lib/postgresql/data`

Then run:

```
$ cd docker
$ docker-compose -f docker-compose-localhost.yml up
```

Every time you reset your local hardhat node you will need to delete the `data_localhost` folder that is created by the `docker-compose` command before running it again.

The next step is the deploy the subgraph to the local graph node.
Checkout the subgraph project from [GitHub](https://github.com/cartesi-corp/subgraph).
Then yarn link the project to the local `staking-pool` project by running `yarn link` at the `staking-pool` project and than `yarn link @cartesi/staking-pool` at the `subgraph` project.

Then run the following commands:

```
$ yarn prepare:localhost
$ yarn create:localhost
$ yarn deploy:localhost
```

### Environment variables

There are two files in the explorer project the`.env.development` and `.env.production` as reference. You can create a file called `.env.development.local` that is gitignored so you can add your secrets there.

The next step is to create an account on [Infura](https://infura.io/) or any other node-rpc. Create a project so you can have access to a node-rpc endpoint.

On your `.env.development.local` set the following var:

- NEXT_PUBLIC_RPC_URL_1=your_mainnet_node_rpc_endpoint_goes_here

> We support ethereum Mainnet(1), Sepolia(11155111) and Devnet (31337),

Check the `.env` to see the available variables. [additional.d.ts](./additional.d.ts) also includes `process.env` declarations for improved IDE autocomplete.

<br>

> You can read more about **nextJS** env vars [here](https://nextjs.org/docs/basic-features/environment-variables)

### Run the application

Simply run:

```
$ pnpm dev
```

### Open application and setup MetaMask

Open the application in your browser at http://localhost:3000
Open MetaMask and switch to a network configured to the url http://localhost:8545 and Chain ID 31337.

### Test coverage reporting

We are using [Coveralls](https://coveralls.io/) as a reporting tool for our tests' coverage. We generate coverage report by running the tests using the `test:ci` npm script. At each build we send the report to Coveralls.

### Release

The project use **tags** that represent releases, including a branch to signal cloud providers to update the production code (e.g. Staking).

That is as follows:

- Combined tag name `v` + SemVer format **tag** (e.g. v3.4.0) to pinpoint repository state on a given production release.
