interface Window {
    ethereum: any;
}

declare namespace NodeJS {
    export interface ProcessEnv {
        NEXT_PUBLIC_ENVIRONMENT: string;
        NEXT_PUBLIC_UNLEASH_PROXY_HOST: string;
        NEXT_PUBLIC_UNLEASH_PROXY_CLIENT_KEY: string;
        NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: string;
        NEXT_PUBLIC_PROJECT_ID: string;
        NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: string;
        NEXT_PUBLIC_MAINNET_GRAPHQL_URL: string;
        NEXT_PUBLIC_SEPOLIA_GRAPHQL_URL: string;
        /**
         * Usually a subgraph ENS graphql URL with your own API/key.
         * More info at {@link https://thegraph.com/explorer/subgraphs/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH?view=Query&chain=arbitrum-one}
         */
        ENS_GRAPHQL_URL: string;
    }
}
