// Copyright (C) 2024 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { eq, sql } from 'drizzle-orm';
import { conflictUpdateSetAllColumns } from '../../../db/helpers/conflictUpdateSetAllColumns';
import {
    addressEnsTable,
    InsertAddressENS,
    UpdateAddressENS,
} from '../../../db/schemas';
import dbClient from '../turso';
import { AddressEns } from './types';

class AddressENSRepository {
    static async getAll() {
        console.time('AddressENSRepository.getAll');
        const list = await dbClient.select().from(addressEnsTable);
        console.timeEnd('AddressENSRepository.getAll');
        return list;
    }

    static async get(address: string) {
        console.time(`AddressENSRepository.get(${address})`);
        const [addressEns] = await dbClient
            .select()
            .from(addressEnsTable)
            .where(eq(addressEnsTable.address, address.toLowerCase()));

        console.timeEnd(`AddressENSRepository.get(${address})`);

        return addressEns;
    }

    static async getAllStaleEntries(ttlInSeconds: number) {
        console.time('AddressENSRepository.getAllStaleEntries');
        const result = await dbClient
            .select({
                id: addressEnsTable.id,
                address: addressEnsTable.address,
                hasEns: addressEnsTable.hasEns,
            })
            .from(addressEnsTable)
            .where(
                sql`${addressEnsTable.updatedAt} < (unixepoch() - ${ttlInSeconds})`
            );

        console.timeEnd('AddressENSRepository.getAllStaleEntries');

        return result;
    }

    static async create(obj: InsertAddressENS) {
        console.time(`AddressENSRepository.create(${obj.address})`);
        const [created] = await dbClient
            .insert(addressEnsTable)
            .values(obj)
            .returning();

        console.timeEnd(`AddressENSRepository.create(${obj.address})`);
        return created;
    }

    static async update(obj: UpdateAddressENS) {
        console.time(`AddressENSRepository.update(${obj.address})`);
        const [updated] = await dbClient
            .insert(addressEnsTable)
            .values(obj)
            .onConflictDoUpdate({
                target: addressEnsTable.id,
                set: conflictUpdateSetAllColumns(addressEnsTable),
            })
            .returning();

        console.timeEnd(`AddressENSRepository.update(${obj.address})`);

        return updated;
    }

    static async updateBulk(values: AddressEns[]) {
        console.time(`AddressENSRepository.updateBulk(${values.length})`);
        const bulkUpdate = await dbClient
            .insert(addressEnsTable)
            .values(values)
            .onConflictDoUpdate({
                target: addressEnsTable.id,
                set: conflictUpdateSetAllColumns(addressEnsTable),
            })
            .returning();

        console.timeEnd(`AddressENSRepository.updateBulk(${values.length})`);

        return bulkUpdate;
    }
}

export default AddressENSRepository;
