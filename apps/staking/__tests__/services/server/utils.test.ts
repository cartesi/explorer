// Copyright (C) 2024 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { createApollo } from '../../../src/services/apollo';
import { isCartesiUser } from '../../../src/services/server/utils';

jest.mock('../../../src/services/apollo');

const createApolloMock = jest.mocked(createApollo, { shallow: true });

describe('Server utils', () => {
    const queryMock = jest.fn();
    const address = '0x07b41c2b437e69dd1523bf1cff5de63ad9bb3dc6';
    const mainnet = 1;

    beforeEach(() => {
        queryMock.mockResolvedValue({
            data: {
                user: null,
                poolUser: null,
                node: null,
            },
        });

        // bare bones mock with only what is required
        createApolloMock.mockReturnValue({
            query: queryMock,
        } as unknown as ApolloClient<NormalizedCacheObject>);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return false when an address is not part of Cartesi ecosystem', async () => {
        const result = await isCartesiUser(address, mainnet);
        expect(result).toEqual(false);
    });

    it('should return true when an address is belongs to a pool-user', async () => {
        queryMock.mockResolvedValue({
            data: {
                poolUser: { id: address },
            },
        });

        const result = await isCartesiUser(address, mainnet);

        expect(result).toEqual(true);
    });

    it('should return true when an address is an user', async () => {
        queryMock.mockResolvedValue({
            data: {
                user: { id: address },
            },
        });

        const result = await isCartesiUser(address, mainnet);
        expect(result).toEqual(true);
    });

    it('should return true when an address is a node', async () => {
        queryMock.mockResolvedValue({
            data: {
                node: { id: address },
            },
        });

        const result = await isCartesiUser(address, mainnet);
        expect(result).toEqual(true);
    });
});
