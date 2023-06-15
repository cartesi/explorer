# Explorer

This is a monorepo holding up two explorer applications from Cartesi. One is the well established Staking platform where users can participate in the network running they own private node, becoming a pool manager and/or also becoming a staking delegator. The second application is the new Rollup's explorer that will support Dapp developers.

## What's inside?

This monorepo uses [Yarn v1](https://classic.yarnpkg.com/) as a package manager and is controlled by [turborepo](https://turbo.build/repo).

### Package Installation

You can add, remove and upgrade packages from within your monorepo using your package manager's built-in commands:

`yarn workspace <workspace> add <package>`

> Refer to Turborepo [package-installation](https://turbo.build/repo/docs/handbook/package-installation) session for more information.

### Apps and Packages

-   `rollups`: The new rollups explorer App that is [Next.js](https://nextjs.org/) app
-   `staking`: The staking explorer also a [Next.js](https://nextjs.org/) app
-   `ui`: House to core react components shared by both [rollups](./apps//rollups/) and [staking](./apps//staking/) applications.
-   `services`: Holds common logic to share between apps e.g ENS service.
-   `utils`: Holds utilities used inside the packages and also Apps.
-   `wallet`: Holds common implementation of a web3 wallet to be shared between apps.
-   `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
-   `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools already setup for you:

-   [TypeScript](https://www.typescriptlang.org/) for static type checking
-   [ESLint](https://eslint.org/) for code linting
-   [Prettier](https://prettier.io) for code formatting

### Develop

To develop all apps and packages, run the following command:

```
yarn run dev
```

> Note: When running turborepo tasks like `dev` or `build` it will run rollups and staking in parallel. e.g. when you want only to do `dev` on staking app, you should filter the task

The filtering should be done by the **name** inside the package.json of the targeted `apps/*`

```
yarn run dev --filter staking
```

or

```
yarn run dev --filter rollups
```

### Test coverage reporting

We are using [Coveralls](https://coveralls.io/) as a reporting tool for our tests' coverage. Each workspace that has tests, generates coverage report for them as well using the `test:ci` npm script. At each build we merge coverage reports for all workspaces, and then send the merged report to Coveralls.

To include a new workspace that has tests in the merged coverage report, all you need to do is provide in its dedicated `package.json` file the `test:ci` script (found in existing workspaces).

### Build

To build all apps, run the following command:

```
yarn run build
```

> Note: We are not building the packages since it is only for internal use. **The transpilation/compilation is delegated to the application using the package.** _That may change in the future._

### Release

The project use **tags** that represent releases, including a branch to signal cloud providers to update the production code (e.g. Staking).

That is as follows:

-   Combined tag name `v` + SemVer format **tag** (e.g. v3.4.0) to pinpoint repository state on a given production release.
-   A different **tag** format for rollups, i.e. `rollups@0.9.0`, is used to initiate the process of releasing docker images with specific versions that match the versioning other rollups projects are using for unison sake.

> The process initiated for rollups docker image generation is a [GitHub Action](./.github/workflows/docker-rollups.yml)

## Turborepo Useful Links

Learn more about the power of Turborepo:

-   [Pipelines](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
-   [Caching](https://turbo.build/repo/docs/core-concepts/caching)
-   [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
-   [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
-   [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
-   [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
