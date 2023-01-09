// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import { useWallet } from '@explorer/wallet';
import { useEffect, useState } from 'react';

export type Chain = {
    id: string;
    token: string;
    label: string;
    rpcUrl: string;
};

export class Explorer {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    address(address: string): string {
        return `${this.url}/address/${address}`;
    }

    tx(address: string): string {
        return `${this.url}/tx/${address}`;
    }

    token(address: string): string {
        return `${this.url}/token/${address}`;
    }

    block(block: number): string {
        return `${this.url}/block/${block}`;
    }

    graphql(address: string): string {
        return `${this.url}/graphql/${address}`;
    }
}

interface DeploymentReceipt {
    blockHash: string;
    blockNumber: number;
}

export interface Deployment {
    address: string;
    transactionHash: string;
    receipt: DeploymentReceipt;
}

export interface Network {
    name: string;
    chainId: number;
    explorer?: Explorer;
    graphql: (address: string, env?: string) => string;
    deployment: (contract: string) => Deployment | undefined;
    chain: Chain;
}

const networks: Record<number, Network> = {};

// TODO: Revisit how to load ABI generated for local-development.
/**
 * CODE REFERENCE FROM STAKING
 * Fetches the localhost.json file for local-node development that is available as a public static file
 * @returns
 */
// const getLocalABI = async () => {
//     if (!fetchedLocalABI) {
//         const { data } = await axios.get('/abi/localhost.json');
//         if (isObject(data)) {
//             fetchedLocalABI = true;
//             // guessing the configuration is correct
//             abi.localhost = data as ChainAbi;
//         }
//     }

//     return abi.localhost;
// };
/*
if (process.env.NODE_ENV === 'development') {
    networks['0x7a69'] = {
        name: 'localhost',
        chainId: 31337,
        explorer: undefined,
        graphql: () => 'http://localhost:4000/graphql',
        deployment: (contract) =>
            require(`../../../deployments/localhost/${contract}.json`),
        chain: {
            id: '0x7a69',
            token: 'ETH',
            label: 'localhost',
            rpcUrl: 'http://localhost:8545',
        },
    };
}
*/
networks[0x5] = {
    name: 'Goerli',
    chainId: 5,
    graphql: (address, env = 'staging') =>
        `https://${address}.goerli.rollups.${env}.cartesi.io/graphql`,
    explorer: new Explorer('https://goerli.etherscan.io'),
    deployment: (contract) =>
        require(`@cartesi/rollups/deployments/goerli/${contract}.json`),
    chain: {
        id: '0x5',
        token: 'ETH',
        label: 'Goerli',
        rpcUrl: 'https://rpc.ankr.com/eth_goerli',
    },
};

networks[0x66eed] = {
    name: 'Arbitrum Goerli',
    chainId: 421613,
    graphql: (address, env = 'staging') =>
        `https://${address}.arbitrum-goerli.rollups.${env}.cartesi.io/graphql`,
    explorer: new Explorer('https://goerli.arbiscan.io'),
    deployment: (contract) =>
        require(`@cartesi/rollups/deployments/arbitrum_goerli/${contract}.json`),
    chain: {
        id: '0x66EED',
        token: 'ETH',
        label: 'Arbitrum Goerli',
        rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc/',
    },
};

networks[0x13881] = {
    name: 'Polygon Mumbai',
    chainId: 80001,
    graphql: (address, env = 'staging') =>
        `https://${address}.polygon-mumbai.rollups.${env}.cartesi.io/graphql`,
    explorer: new Explorer('https://mumbai.polygonscan.com'),
    deployment: (contract) =>
        require(`@cartesi/rollups/deployments/polygon_mumbai/${contract}.json`),
    chain: {
        id: '0x13881',
        token: 'MATIC',
        label: 'Polygon Mumbai',
        rpcUrl: 'https://rpc.ankr.com/polygon_mumbai',
    },
};

export const useNetwork = (): Network | undefined => {
    const [network, setNetwork] = useState<Network | undefined>();
    const wallet = useWallet();

    useEffect(() => {
        if (wallet && wallet.library && wallet.chainId) {
            setNetwork(networks[wallet.chainId]);
        } else {
            setNetwork(undefined);
        }
    }, [wallet]);
    return network;
};

export default networks;
