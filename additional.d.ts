interface Window {
    ethereum: any;
}

declare namespace NodeJS {
    export interface ProcessEnv {
        NEXT_PUBLIC_ENVIRONMENT: string;
        NEXT_PUBLIC_UNLEASH_PROXY_HOST: string;
        NEXT_PUBLIC_UNLEASH_PROXY_CLIENT_KEY: string;
        NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: string;
        NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: string;
        NEXT_PUBLIC_MAINNET_GRAPHQL_URL: string;
        NEXT_PUBLIC_SEPOLIA_GRAPHQL_URL: string;
        
        
        NEXT_PUBLIC_FLAG_POS_V2_ENABLED: string;
        NEXT_PUBLIC_FLAG_ANKR_ENABLED: string;
        /**
         * the node-rpc endpoint to access ethereum mainnet network.
         * Default to https://rpc.ankr.com/eth
         */
        NEXT_PUBLIC_RPC_URL_1: string;
        /**
         * the node-rpc endpoint to access ethereum sepolia network.
         * Default to 'https://rpc.ankr.com/eth_sepolia'
         */
        NEXT_PUBLIC_RPC_URL_11155111: string;
        /**
         * the node-rpc endpoint to your local node (e.g. foundry).
         * Default to http://localhost:8545
         */
        NEXT_PUBLIC_RPC_URL_31337: string;
        /**
         * The fully-qualifies domain name of your deployed DAPP.
         * @description It is strongly recommended to supply a dappUrl to the WalletConnect initial config
         * as it is required by some wallets (i.e. MetaMask) to allow connection.
         */
        NEXT_PUBLIC_DAPP_URL: string;
        /**
         * Usually a subgraph ENS graphql URL with your own API/key.
         * More info at {@link https://thegraph.com/explorer/subgraphs/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH?view=Query&chain=arbitrum-one}
         */
        ENS_GRAPHQL_URL: string;
        /**
         *  Storage to be used (e.g. ens information). It can have the following formats
         *  remote service: libsql://{database-name}-{company-name}.turso.io or
         *  local development: file:{path-to-your-local-file}.db
         */
        TURSO_DATABASE_URL: string;
        /**
         * Only necessary when using the Turso platform. For development
         * with local db it is not necessary.
         */
        TURSO_AUTH_TOKEN?: string;

        /**
         * A node to fetch mainnet blockchain information. e.g. Alchemy / Infura. Not exposed to the client.
         */
        HTTP_MAINNET_NODE_RPC: string;

        /**
         * Maximum number of entries per request when fetching ENS information. It is configurable but default and maximum is 900 entries.
         * Therefore, the number here dictates the relation between entries-limit and concurrent calls to be created when this limit is exceeded.
         * @default 900
         */
        ENS_ENTRIES_PER_REQ_LIMIT: string;

        /**
         * should be a number that set when ENS information about an address
         * is considered staled.
         */
        ENS_ENTRY_TTL: string;

        /**
         * An authorization header value passed down by a CRON service calling
         * functions under /api/cron/*. It can be any agreed value.
         */
        CRON_SECRET: string;
    }
}
