// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import axios from 'axios';

export interface IChainData {
    name: string;
    chain: string;
    network: string;
    rpc: string[];
    faucets: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    infoURL: string;
    shortName: string;
    chainId: number;
    networkId: number;
}

export const allChainsUrl = 'https://chainid.network/chains.json';

export async function getAllChains(): Promise<IChainData[]> {
    const response = await axios.get(allChainsUrl);
    return response.data;
}

export const getChainUrl = (chainId: number) =>
    `https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/chains/eip155-${chainId}.json`;

export const chainErrorData = {
    name: 'Private',
    chain: 'Private',
    network: 'Private',
    rpc: [],
    faucets: [],
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    infoURL: '',
    shortName: 'private',
};

export async function getChain(chainId: number): Promise<IChainData> {
    try {
        const response = await axios.get(getChainUrl(chainId));
        return response.data;
    } catch (e) {
        return {
            ...chainErrorData,
            chainId: chainId,
            networkId: chainId,
        };
    }
}

export async function getChainByChainId(chainId: number): Promise<IChainData> {
    const chainData = await getChain(chainId);
    return chainData;
}

export async function getChainByKeyValue(
    key: string,
    value: any
): Promise<IChainData> {
    const allChains = await getAllChains();

    let chainData = null;

    const matches = allChains.filter((chain) => chain[key] === value);

    if (matches && matches.length) {
        chainData = matches[0];
    }

    if (!chainData) {
        throw new Error(`No chain found matching ${key}=${value}`);
    }

    return chainData;
}

export async function getChainByNetworkId(
    networkId: number
): Promise<IChainData> {
    const chainData = await getChainByKeyValue('networkId', networkId);
    return chainData;
}

export async function convertNetworkIdToChainId(
    networkId: number
): Promise<number> {
    const chainData = await getChainByNetworkId(networkId);
    return chainData.chainId;
}

export async function convertChainIdToNetworkId(
    chainId: number
): Promise<number> {
    const chainData = await getChain(chainId);
    return chainData.networkId;
}
