// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    allChainsUrl,
    chainErrorData,
    convertChainIdToNetworkId,
    convertNetworkIdToChainId,
    getAllChains,
    getChain,
    getChainByChainId,
    getChainByKeyValue,
    getChainByNetworkId,
    getChainUrl,
    IChainData,
} from '../../src/services/chain';

global.fetch = jest.fn();
const mockFetchGet = global.fetch as jest.MockedFunction<typeof global.fetch>;

const allChains = [
    {
        name: 'ethereum',
    },
    {
        name: 'polygon',
    },
    {
        name: 'arbitrum',
    },
    {
        name: 'optimism',
    },
] as unknown as IChainData[];

describe('chain service', () => {
    it('should invoke GET http request for all chains with correct endpoint', async () => {
        let url = null;
        mockFetchGet.mockImplementation((endpoint) => {
            url = endpoint;
            return Promise.resolve({
                json: () => new Promise((resolve) => resolve({})),
            } as Response);
        });

        await getAllChains();

        expect(url).toBe(allChainsUrl);
    });

    it('should invoke GET http request for specific chain with correct chain url', async () => {
        const chainId = 5;
        let url = null;
        mockFetchGet.mockImplementation((endpoint) => {
            url = endpoint;
            return Promise.resolve({
                json: () => new Promise((resolve) => resolve({})),
            } as Response);
        });

        await getChain(chainId);

        expect(url).toBe(getChainUrl(chainId));
    });

    it('should invoke GET http request with correct chain url', async () => {
        const chainId = 5;
        mockFetchGet.mockImplementation(() => {
            return Promise.reject({
                json: () => new Promise((resolve) => resolve({})),
            } as Response);
        });

        const result = await getChain(chainId);

        expect(result).toStrictEqual({
            ...chainErrorData,
            chainId: chainId,
            networkId: chainId,
        });
    });

    it('should return networkId when invoking convertChainIdToNetworkId function', async () => {
        const chainId = 5;
        const networkId = 2;
        mockFetchGet.mockImplementation(() => {
            return Promise.resolve({
                json: () =>
                    new Promise((resolve) =>
                        resolve({
                            networkId,
                        })
                    ),
            } as Response);
        });

        const result = await convertChainIdToNetworkId(chainId);

        expect(result).toBe(networkId);
    });

    it('should return networkId when invoking getChainByChainId function', async () => {
        const chainId = 5;
        const networkId = 2;
        mockFetchGet.mockImplementation(() => {
            return Promise.resolve({
                json: () =>
                    new Promise((resolve) =>
                        resolve({
                            networkId,
                        })
                    ),
            } as Response);
        });

        const result = await getChainByChainId(chainId);

        expect(result.networkId).toBe(networkId);
    });

    it('should return correct chainData when invoking getChainByKeyValue function', async () => {
        mockFetchGet.mockImplementation(() => {
            return Promise.resolve({
                json: () => new Promise((resolve) => resolve(allChains)),
            } as Response);
        });

        const key = 'name';
        const value = 'ethereum';
        const result = await getChainByKeyValue(key, value);

        expect(result).toStrictEqual(allChains.find((c) => c[key] === value));
    });

    it('should throw error when invoking getChainByKeyValue function with key/value that does not match any chain', async () => {
        mockFetchGet.mockImplementation(() => {
            return Promise.resolve({
                json: () => new Promise((resolve) => resolve(allChains)),
            } as Response);
        });

        const key = 'name';
        const value = 'test-abc';

        try {
            await getChainByKeyValue(key, value);
        } catch (e) {
            expect(e.message).toBe(`No chain found matching ${key}=${value}`);
        }
    });

    it('should return correct chainData when invoking getChainByNetworkId function', async () => {
        const networkId = 1;
        const chains = allChains.map((chain, index) => ({
            ...chain,
            networkId: index + 1,
        }));
        mockFetchGet.mockImplementation(() => {
            return Promise.resolve({
                json: () => new Promise((resolve) => resolve(chains)),
            } as Response);
        });

        const result = await getChainByNetworkId(networkId);

        expect(result).toStrictEqual(
            chains.find((c) => c.networkId === networkId)
        );
    });

    it('should return correct chainData when invoking convertNetworkIdToChainId function', async () => {
        const networkId = 1;
        const chains = allChains.map((chain, index) => ({
            ...chain,
            networkId: index + 1,
            chainId: index + 1,
        }));
        mockFetchGet.mockImplementation(() => {
            return Promise.resolve({
                json: () => new Promise((resolve) => resolve(chains)),
            } as Response);
        });

        const result = await convertNetworkIdToChainId(networkId);

        expect(result).toStrictEqual(
            chains.find((c) => c.networkId === networkId).chainId
        );
    });
});
