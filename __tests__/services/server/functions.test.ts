// Copyright (C) 2025 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { ObservableQuery } from '@apollo/client';
import { ethers } from 'ethers';
import { GetEnsDomainsQuery } from '../../../src/graphql/queries/ensDomains';
import client from '../../../src/services/apolloENSClient';
import {
    getENSData,
    getFreshENSData,
} from '../../../src/services/server/ens/functions';
import { QueriedDomain } from '../../../src/services/server/ens/types';

jest.mock('ethers');
jest.mock('../../../src/services/apolloENSClient', () => {
    return {
        __esModule: true,
        default: {
            query: jest.fn(),
        },
    };
});

const providerMock = jest.mocked(ethers.providers.JsonRpcProvider);
const clientMock = jest.mocked(client, { shallow: true });

const createAvatarUrlResolver = (url: string) => {
    const address = '0x002';
    const name = 'resolver';
    const provider = new ethers.providers.BaseProvider(11155111);

    return {
        getText: async () => url,
        name,
        address,
        provider,
        _fetchBytes: async () => address,
        _getAddress() {
            return '';
        },
        getAddress: async () => address,
        getContentHash: async () => '',
        getAvatar: async () => null,
        supportsWildcard: async () => false,
        _resolvedAddress: '',
        _supportsEip2544: Promise.resolve(false),
        _fetch: async () => '',
    } as ethers.providers.Resolver;
};

const buildENSResponse = () => [
    {
        createdAt: 1740987259,
        id: '1',
        name: 'my-pool',
        resolvedAddress: {
            id: validAddress,
        },
    },
];

const setENSQueryReturn = (list: QueriedDomain[]) => {
    clientMock.query.mockResolvedValue({
        data: { domains: list },
    } as ObservableQuery.Result<GetEnsDomainsQuery>);
};

const validAddress = '0x07b41c2b437e69dd1523bf1cff5de63ad9bb3dc6';

describe('ENS Functions', () => {
    const errorLog = jest.fn();
    const infoLog = jest.fn();
    const entry = { address: validAddress };
    beforeEach(() => {
        const resolver = createAvatarUrlResolver('');
        providerMock.prototype.getResolver.mockResolvedValue(resolver);
        setENSQueryReturn([]);

        jest.spyOn(console, 'info').mockImplementation(infoLog);
        jest.spyOn(console, 'time').mockImplementation(jest.fn());
        jest.spyOn(console, 'timeEnd').mockImplementation(jest.fn());
        jest.spyOn(console, 'error').mockImplementation(errorLog);
    });

    afterEach(() => {
        jest.clearAllMocks();
        errorLog.mockRestore();
        infoLog.mockRestore();
    });

    describe('getENSData', () => {
        it('should include ENS status even for address without registration', async () => {
            const entry = { address: validAddress };
            const {
                data: [ensAddressData],
            } = await getENSData([entry]);

            expect(ensAddressData).toEqual({
                address: validAddress,
                hasEns: false,
            });
        });

        it('should set the name when returned from ENS service', async () => {
            setENSQueryReturn([
                {
                    createdAt: 1740987259,
                    id: '1',
                    name: 'my-pool',
                    resolvedAddress: {
                        id: validAddress,
                    },
                },
            ]);
            const {
                data: [expectedData],
            } = await getENSData([entry]);

            expect(expectedData).toHaveProperty('name', 'my-pool');
            expect(expectedData).toHaveProperty('hasEns', true);
            expect(expectedData).toHaveProperty('avatarUrl', '');
        });

        it('should search and update the avatar-url when the name is set', async () => {
            setENSQueryReturn(buildENSResponse());
            const resolver = createAvatarUrlResolver(
                'https://host.com/avatar.png'
            );
            providerMock.prototype.getResolver.mockResolvedValue(resolver);

            const {
                data: [expectedData],
            } = await getENSData([entry]);

            expect(expectedData).toHaveProperty('name', 'my-pool');
            expect(expectedData).toHaveProperty('hasEns', true);
            expect(expectedData).toHaveProperty(
                'avatarUrl',
                'https://host.com/avatar.png'
            );
        });

        it('should skip the avatar lookup when ENS information is not available', async () => {
            const resolver = createAvatarUrlResolver('');
            resolver.getText = jest.fn();
            providerMock.prototype.getResolver.mockResolvedValue(resolver);

            const {
                state,
                data: [expectedData],
            } = await getENSData([entry]);

            expect(state).toEqual('ok');
            expect(expectedData).toEqual({
                hasEns: false,
                address: validAddress,
            });
            expect(resolver.getText).not.toHaveBeenCalled();
        });

        it('should handle any error when searching domains and skip avatar-url search', async () => {
            clientMock.query.mockRejectedValue(new Error('graphql-mock-error'));
            const {
                state,
                data: [expectedData],
            } = await getENSData([entry]);

            expect(state).toEqual('ens_query_failed');
            expect(expectedData).toStrictEqual({
                address: validAddress,
                hasEns: false,
            });
            expect(errorLog).toHaveBeenCalledTimes(1);
            expect(errorLog.mock.calls[0][0]).toHaveProperty(
                'message',
                'graphql-mock-error'
            );
        });

        it('should log and continue when an error occur when searching for an avatar-url', async () => {
            const getText = jest
                .fn()
                .mockRejectedValue(new Error('no name found!'));
            setENSQueryReturn(buildENSResponse());
            const resolver = createAvatarUrlResolver('');
            resolver.getText = getText;
            providerMock.prototype.getResolver.mockResolvedValue(resolver);

            const {
                state,
                data: [expectedData],
            } = await getENSData([entry]);

            expect(state).toEqual('ok');
            expect(expectedData).toEqual({
                address: validAddress,
                avatarUrl: null,
                hasEns: true,
                name: 'my-pool',
            });

            expect(errorLog).toHaveBeenCalledTimes(1);
            expect(errorLog.mock.calls[0][0]).toEqual(
                'GET_AVATAR_URL: (my-pool) => Fail to get avatar.\nReason: no name found!'
            );
        });
    });

    describe('getFreshENSData', () => {
        it('should partition request when entries are above the limit', async () => {
            setENSQueryReturn([
                {
                    createdAt: 1740987259,
                    id: '1',
                    name: 'my-pool',
                    resolvedAddress: {
                        id: validAddress,
                    },
                },
            ]);
            const resolver = createAvatarUrlResolver(
                'http://host.com/avatar.png'
            );
            providerMock.prototype.getResolver.mockResolvedValue(resolver);

            const dummyStaleEntry = { ...entry, hasEns: false };

            const expectedPayloads = await getFreshENSData([
                { ...dummyStaleEntry, id: 1 },
                { ...dummyStaleEntry, id: 2 },
                { ...dummyStaleEntry, id: 3 },
            ]);

            const expectedDummyData = {
                ...entry,
                avatarUrl: 'http://host.com/avatar.png',
                hasEns: true,
                name: 'my-pool',
            };

            expect(expectedPayloads.length).toEqual(2);
            expect(expectedPayloads[0]).toEqual({
                state: 'ok',
                data: [
                    { ...expectedDummyData, id: 1 },
                    { ...expectedDummyData, id: 2 },
                ],
            });
            expect(expectedPayloads[1]).toEqual({
                state: 'ok',
                data: [{ ...expectedDummyData, id: 3 }],
            });

            expect(infoLog).toHaveBeenCalledTimes(10);
            expect(infoLog.mock.calls[0][0]).toEqual(
                '(GET_FRESH_ENS_DATA): Maximum items per request 2'
            );
            expect(infoLog.mock.calls[1][0]).toEqual(
                '(GET_FRESH_ENS_DATA): Total stale entries to check 3'
            );
            expect(infoLog.mock.calls[2][0]).toEqual(
                '(GET_FRESH_ENS_DATA): Breaking into 2 concurrent calls'
            );
        });
    });
});
