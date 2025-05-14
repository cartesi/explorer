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
import {
    isCartesiUser,
    getFormattedEnsName,
} from '../../../src/services/server/utils';
import AddressENSService from '../../../src/services/server/ens/AddressENSService';

jest.mock('../../../src/services/apollo');

jest.mock('../../../src/services/server/ens/AddressENSService');

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

    describe('getFormattedEnsName', () => {
        it('should return the ENS name when it exists', async () => {
            const address = '0x2942aa4356783892c624125acfbbb80d29629a9d';
            const name = 'funky-name.eth';

            jest.spyOn(AddressENSService, 'getEntry').mockImplementation(
                () => Promise.resolve({ ok: true, data: { name } }) as any
            );

            const result = await getFormattedEnsName(address);
            expect(result).toBe(name);
        });

        it('should return the formatted address when ENS name does not exist', async () => {
            const address = '0x2942aa4356783892c624125acfbbb80d29629a9d';

            jest.spyOn(AddressENSService, 'getEntry').mockImplementation(
                () => Promise.resolve({ ok: false }) as any
            );

            const result = await getFormattedEnsName(address);
            expect(result).toBe(address.slice(0, 12));
        });
    });
});
