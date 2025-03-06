// Copyright (C) 2024 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { SelectAddressENS } from '../../../src/db/schemas';
import { default as Repository } from '../../../src/services/server/ens/AddressENSRepository';
import AddressENSService from '../../../src/services/server/ens/AddressENSService';
import {
    getENSData,
    getFreshENSData,
} from '../../../src/services/server/ens/functions';
import { isCartesiUser } from '../../../src/services/server/utils';

jest.mock('../../../src/services/server/ens/functions', () => {
    return {
        getFreshENSData: jest.fn(),
        getENSData: jest.fn(),
    };
});
jest.mock('../../../src/services/server/utils', () => {
    return {
        isCartesiUser: jest.fn(),
    };
});

jest.mock('../../../src/services/server/ens/AddressENSRepository', () => {
    return {
        __esModule: true,
        default: {
            getAll: jest.fn(),
            get: jest.fn(),
            getAllStaleEntries: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            updateBulk: jest.fn(),
        },
    };
});

const getENSDataMock = jest.mocked(getENSData);
const getFreshENSDataMock = jest.mocked(getFreshENSData);
const isCartesiUserMock = jest.mocked(isCartesiUser);
const repositoryMock = jest.mocked(Repository);
const address = '0x07b41c2b437e69dd1523bf1cff5de63ad9bb3dc6';
const validEntry: SelectAddressENS = {
    id: 1,
    address,
    avatarUrl: 'https://some-host/image.png',
    hasEns: true,
    name: 'enzo.eth',
    updatedAt: 100000,
};

describe('Address ENS Service', () => {
    const errorLogSpy = jest
        .spyOn(console, 'error')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(() => {});
    const infoLogSpy = jest.spyOn(console, 'info').mockImplementation(() => {});

    beforeEach(() => {
        getFreshENSDataMock.mockResolvedValue([]);
        getENSDataMock.mockResolvedValue({ state: 'ok', data: [] });
        isCartesiUserMock.mockResolvedValue(false);
        repositoryMock.get.mockResolvedValue(null);
        repositoryMock.getAll.mockResolvedValue([]);
        repositoryMock.getAllStaleEntries.mockResolvedValue([]);
        repositoryMock.create.mockImplementation((obj) => {
            return Promise.resolve({
                id: 1,
                address: obj.address,
                avatarUrl: obj.avatarUrl,
                hasEns: obj.hasEns,
                name: obj.name,
                updatedAt: 10000,
            });
        });
        repositoryMock.update.mockImplementation((obj) => {
            return Promise.resolve({
                id: obj.id,
                name: obj.name,
                address: obj.address,
                hasEns: obj.hasEns,
                avatarUrl: obj.avatarUrl,
                updatedAt: 20000,
            });
        });

        repositoryMock.updateBulk.mockImplementation((entries) => {
            const updated = entries.map((e) => {
                return { ...e, updatedAt: 30000 };
            });

            return Promise.resolve(updated as SelectAddressENS[]);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getEntry method', () => {
        it('should quick return the entry when it is found', async () => {
            repositoryMock.get.mockResolvedValue(validEntry);
            const result = await AddressENSService.getEntry(address, 1);

            expect(result).toEqual({
                ok: true,
                data: {
                    id: 1,
                    hasEns: true,
                    avatarUrl: 'https://some-host/image.png',
                    name: 'enzo.eth',
                    address: '0x07b41c2b437e69dd1523bf1cff5de63ad9bb3dc6',
                },
            });
        });

        it('should fail the service request when the address is not in the Cartesi Ecosystem', async () => {
            const result = await AddressENSService.getEntry(address, 1);
            expect(result).toEqual({ ok: false, error: 'not_an_user' });
        });

        it('should return an new entry when not available in the repository', async () => {
            const newAddress = '0x07b41c2b437e69dd1523bf1cff5de63ad9bb3dd7';
            isCartesiUserMock.mockResolvedValue(true);
            getENSDataMock.mockResolvedValue({
                state: 'ok',
                data: [{ address: newAddress, hasEns: false }],
            });

            const result = await AddressENSService.getEntry(newAddress, 1);

            expect(result).toEqual({
                ok: true,
                data: {
                    address: '0x07b41c2b437e69dd1523bf1cff5de63ad9bb3dd7',
                    avatarUrl: undefined,
                    hasEns: false,
                    id: 1,
                    name: undefined,
                },
            });
        });

        it('should handle runtime errors and return the result to the callee', async () => {
            isCartesiUserMock.mockRejectedValue(
                new Error('GraphQL out of service')
            );

            const result = await AddressENSService.getEntry(address, 1);
            expect(result).toEqual({ ok: false, error: 'unexpected' });
            expect(errorLogSpy).toHaveBeenCalledWith(
                new Error('GraphQL out of service')
            );
        });
    });

    describe('listAll method', () => {
        it('should return all the available entries including only allowed fields', async () => {
            const entries = [
                { ...validEntry },
                { ...validEntry, id: 2 },
                { ...validEntry, id: 3 },
            ];

            repositoryMock.getAll.mockResolvedValue(entries);

            const result = await AddressENSService.listAll();

            expect(result).toEqual({
                ok: true,
                data: entries.map((e) => ({ ...e, updatedAt: undefined })),
            });
        });

        it('should handle any internal error gracefully', async () => {
            repositoryMock.getAll.mockRejectedValue(
                new Error('Connection pipe is broken')
            );

            const result = await AddressENSService.listAll();

            expect(result).toEqual({ ok: false, error: 'unexpected' });
            expect(errorLogSpy).toHaveBeenCalledWith(
                new Error('Connection pipe is broken')
            );
        });
    });

    describe('refreshEntries method', () => {
        it('should return ok and not call ENS check internals when there are no stale entries', async () => {
            const result = await AddressENSService.refreshEntries();

            expect(result).toEqual({
                ok: true,
                data: { success: true, count: 0 },
            });
            expect(getENSDataMock).not.toHaveBeenCalled();
        });

        it('should check all the stale entries and update with fresh result from sources', async () => {
            const staleEntry = {
                id: validEntry.id,
                address: validEntry.address,
                hasEns: validEntry.hasEns,
            };

            const staleEntries = [
                { ...staleEntry },
                { ...staleEntry, id: 2 },
                { ...staleEntry, id: 3 },
            ];

            const freshEntries = [
                {
                    ...staleEntry,
                    name: validEntry.name,
                    avatarUrl: validEntry.avatarUrl,
                },
                { ...staleEntry, id: 2, name: 'dev.enzo.eth' },
                { ...staleEntry, id: 3, name: 'qa.enzo.eth' },
            ];

            repositoryMock.getAllStaleEntries.mockResolvedValue(staleEntries);
            getFreshENSDataMock.mockResolvedValue([
                {
                    state: 'ok',
                    data: freshEntries,
                },
            ]);

            const result = await AddressENSService.refreshEntries();

            expect(getFreshENSDataMock).toHaveBeenCalledTimes(1);
            expect(repositoryMock.updateBulk).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                ok: true,
                data: { success: true, count: 3 },
            });

            expect(infoLogSpy).toHaveBeenCalledTimes(5);
            expect(infoLogSpy.mock.calls[0][0]).toEqual(
                '(Total stale entries): 3'
            );
            expect(infoLogSpy.mock.calls[1][0]).toEqual(
                '(ENS Payloads returned): 1'
            );
            expect(infoLogSpy.mock.calls[2][0]).toEqual(
                '(ENS Payloads in good state): 1'
            );
            expect(infoLogSpy.mock.calls[3][0]).toEqual(
                '(Total entries to refresh): 3'
            );
            expect(infoLogSpy.mock.calls[4][0]).toEqual(
                '(Total entries updated): 3'
            );
        });

        it('should discard payloads that are not in a good state and log the information', async () => {
            const staleEntry = {
                id: validEntry.id,
                address: validEntry.address,
                hasEns: validEntry.hasEns,
            };

            const staleEntries = [
                { ...staleEntry },
                { ...staleEntry, id: 2 },
                { ...staleEntry, id: 3 },
            ];

            const freshEntries = [
                {
                    ...staleEntry,
                    name: validEntry.name,
                    avatarUrl: validEntry.avatarUrl,
                },
                { ...staleEntry, id: 2, name: 'dev.enzo.eth' },
                { ...staleEntry, id: 3, name: 'qa.enzo.eth' },
            ];

            repositoryMock.getAllStaleEntries.mockResolvedValue(staleEntries);
            getFreshENSDataMock.mockResolvedValue([
                {
                    state: 'ok',
                    data: freshEntries,
                },
                {
                    state: 'ok',
                    data: freshEntries,
                },
                {
                    state: 'ens_query_failed',
                    data: freshEntries,
                },
            ]);

            const result = await AddressENSService.refreshEntries();

            expect(getFreshENSDataMock).toHaveBeenCalledTimes(1);
            expect(repositoryMock.updateBulk).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                ok: true,
                data: { success: true, count: 6 },
            });

            expect(infoLogSpy).toHaveBeenCalledTimes(5);
            expect(infoLogSpy.mock.calls[0][0]).toEqual(
                '(Total stale entries): 3'
            );
            expect(infoLogSpy.mock.calls[1][0]).toEqual(
                '(ENS Payloads returned): 3'
            );
            expect(infoLogSpy.mock.calls[2][0]).toEqual(
                '(ENS Payloads in good state): 2'
            );
            expect(infoLogSpy.mock.calls[3][0]).toEqual(
                '(Total entries to refresh): 6'
            );
            expect(infoLogSpy.mock.calls[4][0]).toEqual(
                '(Total entries updated): 6'
            );
        });

        it('should log and signal request completion but mark success as false when all payloads are discarded', async () => {
            const staleEntry = {
                id: validEntry.id,
                address: validEntry.address,
                hasEns: validEntry.hasEns,
            };

            const staleEntries = [
                { ...staleEntry },
                { ...staleEntry, id: 2 },
                { ...staleEntry, id: 3 },
            ];

            const freshEntries = [
                {
                    ...staleEntry,
                    name: validEntry.name,
                    avatarUrl: validEntry.avatarUrl,
                },
                { ...staleEntry, id: 2, name: 'dev.enzo.eth' },
                { ...staleEntry, id: 3, name: 'qa.enzo.eth' },
            ];

            repositoryMock.getAllStaleEntries.mockResolvedValue([
                ...staleEntries,
                ...staleEntries,
                ...staleEntries,
            ]);

            getFreshENSDataMock.mockResolvedValue([
                {
                    state: 'ens_query_failed',
                    data: freshEntries,
                },
                {
                    state: 'ens_query_failed',
                    data: freshEntries,
                },
                {
                    state: 'ens_query_failed',
                    data: freshEntries,
                },
            ]);

            const result = await AddressENSService.refreshEntries();

            expect(getFreshENSDataMock).toHaveBeenCalledTimes(1);
            expect(repositoryMock.updateBulk).not.toHaveBeenCalled();

            expect(result).toEqual({
                ok: true,
                data: { success: false, count: 0 },
            });

            expect(infoLogSpy).toHaveBeenCalledTimes(4);
            expect(infoLogSpy.mock.calls[0][0]).toEqual(
                '(Total stale entries): 9'
            );
            expect(infoLogSpy.mock.calls[1][0]).toEqual(
                '(ENS Payloads returned): 3'
            );
            expect(infoLogSpy.mock.calls[2][0]).toEqual(
                '(ENS Payloads in good state): 0'
            );
            expect(infoLogSpy.mock.calls[3][0]).toEqual(
                '(Total entries to refresh): 0'
            );
        });

        it('should handle db runtime internal errors gracefully', async () => {
            repositoryMock.getAllStaleEntries.mockRejectedValue(
                new Error('Connection closed')
            );

            const result = await AddressENSService.refreshEntries();

            expect(result).toEqual({ ok: false, error: 'unexpected' });
            expect(errorLogSpy).toHaveBeenCalledWith(
                new Error('Connection closed')
            );
        });
    });
});
