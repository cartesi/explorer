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

interface ContractAbi {
    address: string;
    abi: any[];
}

interface ContractMap {
    [name: string]: ContractAbi;
}

interface ChainAbi {
    name: string;
    chainId: string;
    contracts: ContractMap;
}

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
    deployment: (contract: string) => Promise<Deployment | undefined>;
    chain: Chain;
}

class Abi {
    private val = null;

    get localhost() {
        return this.val;
    }

    set localhost(value) {
        this.val = value;
    }
}

const abi = new Abi();

export const loadLocalAbi = (): Promise<ChainAbi> => {
    return new Promise((resolve, reject) => {
        fetch('/abi/localhost.json')
            .then((res) => res.json())
            .then((localAbi) => {
                if (typeof localAbi === 'object' && localAbi !== null) {
                    abi.localhost = localAbi;
                }

                resolve(localAbi);
            })
            .catch((err) => reject(err));
    });
};

export const networks: Record<number, Network> = {
    [0x5]: {
        name: 'Goerli',
        chainId: 5,
        graphql: (address, env = 'staging') =>
            `https://${address}.goerli.rollups.${env}.cartesi.io/graphql`,
        explorer: new Explorer('https://goerli.etherscan.io'),
        deployment: (contract) =>
            import(`@cartesi/rollups/deployments/goerli/${contract}.json`),
        chain: {
            id: '0x5',
            token: 'ETH',
            label: 'Goerli',
            rpcUrl: 'https://rpc.ankr.com/eth_goerli',
        },
    },
    [0x66eed]: {
        name: 'Arbitrum Goerli',
        chainId: 421613,
        graphql: (address, env = 'staging') =>
            `https://${address}.arbitrum-goerli.rollups.${env}.cartesi.io/graphql`,
        explorer: new Explorer('https://goerli.arbiscan.io'),
        deployment: (contract) =>
            import(
                `@cartesi/rollups/deployments/arbitrum_goerli/${contract}.json`
            ),
        chain: {
            id: '0x66EED',
            token: 'ETH',
            label: 'Arbitrum Goerli',
            rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc/',
        },
    },
    [0x13881]: {
        name: 'Polygon Mumbai',
        chainId: 80001,
        graphql: (address, env = 'staging') =>
            `https://${address}.polygon-mumbai.rollups.${env}.cartesi.io/graphql`,
        explorer: new Explorer('https://mumbai.polygonscan.com'),
        deployment: (contract) =>
            import(
                `@cartesi/rollups/deployments/polygon_mumbai/${contract}.json`
            ),
        chain: {
            id: '0x13881',
            token: 'MATIC',
            label: 'Polygon Mumbai',
            rpcUrl: 'https://rpc.ankr.com/polygon_mumbai',
        },
    },
};

if (process.env.NEXT_PUBLIC_DAPP_LOCAL_DEV === 'true') {
    networks[0x7a69] = {
        name: 'localhost',
        chainId: 31337,
        explorer: undefined,
        graphql: () => 'http://localhost:4000/graphql',
        deployment: (contract) => {
            if (abi.localhost) {
                return Promise.resolve(abi.localhost.contracts?.[contract]);
            }

            return new Promise((resolve, reject) => {
                loadLocalAbi()
                    .then((localAbi: ChainAbi) => {
                        resolve(
                            localAbi.contracts?.[
                                contract
                            ] as unknown as Deployment
                        );
                    })
                    .catch((err) => reject(err));
            });
        },
        chain: {
            id: '0x7a69',
            token: 'ETH',
            label: 'localhost',
            rpcUrl: 'http://localhost:8545',
        },
    };
}

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
