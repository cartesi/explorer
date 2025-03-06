// Copyright (C) 2024 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { defaultTo, pick } from 'lodash/fp';
import { SelectAddressENS } from '../../../db/schemas';
import { ServiceResult } from '../types';
import { isCartesiUser } from '../utils';
import { default as Repository } from './AddressENSRepository';
import { getENSData, getFreshENSData } from './functions';
import { AddressEns, ENSAddressData } from './types';

const ALLOWED_FIELDS = [
    'id',
    'address',
    'hasEns',
    'avatarUrl',
    'name',
] as const;

const prepareReturn = (data: SelectAddressENS) => {
    return pick(ALLOWED_FIELDS, data) as AddressEns;
};

const defaultTTL = 7 * 24 * 60 * 60;
const ENS_ENTRY_TTL = defaultTo(
    defaultTTL,
    parseInt(process.env.ENS_ENTRY_TTL ?? '')
);

export default class AddressENSService {
    static async getEntry(
        address: string,
        chainId: number
    ): Promise<ServiceResult<AddressEns>> {
        try {
            const entry = await Repository.get(address);

            if (entry) return { ok: true, data: prepareReturn(entry) };

            const isUser = await isCartesiUser(address, chainId);

            if (!isUser) {
                return {
                    ok: false,
                    error: 'not_an_user',
                };
            }

            const ensPayload = await getENSData([{ address }]);
            const [ensData] = ensPayload.data;

            const createdEntry = await Repository.create({
                ...ensData,
            });

            return {
                ok: true,
                data: prepareReturn(createdEntry),
            };
        } catch (error) {
            console.error(error);
            return {
                ok: false,
                error: 'unexpected',
            };
        }
    }

    static async listAll(): Promise<ServiceResult<AddressEns[]>> {
        try {
            const entries = await Repository.getAll();
            return {
                ok: true,
                data: entries.map(prepareReturn),
            };
        } catch (error) {
            console.error(error);

            return {
                ok: false,
                error: 'unexpected',
            };
        }
    }

    static async refreshEntries(): Promise<
        ServiceResult<{ success: boolean; count: number }>
    > {
        try {
            const staleList = await Repository.getAllStaleEntries(
                ENS_ENTRY_TTL
            );
            if (staleList.length === 0)
                return { ok: true, data: { success: true, count: 0 } };
            console.info(`(Total stale entries): ${staleList.length}`);

            const ensPayloads = await getFreshENSData(staleList);
            let refreshedList: AddressEns[] = [];
            let payloadFailedStateCount = 0;

            for (let i = 0; i < ensPayloads.length; i++) {
                if (ensPayloads[i].state !== 'ok') {
                    payloadFailedStateCount++;
                    continue;
                }
                refreshedList = refreshedList.concat(
                    ensPayloads[i].data as AddressEns[]
                );
            }

            const payloadInGoodStateCount =
                ensPayloads.length - payloadFailedStateCount;
            console.info(`(ENS Payloads returned): ${ensPayloads.length}`);
            console.info(
                `(ENS Payloads in good state): ${payloadInGoodStateCount}`
            );

            console.info(`(Total entries to refresh): ${refreshedList.length}`);

            if (refreshedList.length === 0)
                return { ok: true, data: { count: 0, success: false } };

            const updatedEntries = await Repository.updateBulk(refreshedList);

            console.info(`(Total entries updated): ${updatedEntries.length}`);

            return {
                ok: true,
                data: {
                    success: true,
                    count: updatedEntries.length,
                },
            };
        } catch (error) {
            console.error(error);

            return {
                ok: false,
                error: 'unexpected',
            };
        }
    }
}
