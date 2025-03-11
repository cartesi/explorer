// Copyright (C) 2024 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { GetEnsDomainsQuery } from '../../../graphql/queries/ensDomains';
import AddressENSRepository from './AddressENSRepository';

export type AddressEns = {
    id: number;
    address: string;
    hasEns: boolean;
    name?: string;
    avatarUrl?: string;
};

export type Entry = {
    id?: number;
    address: string;
};

export type QueriedDomain = GetEnsDomainsQuery['domains'][number];
export type ENSAddressData = {
    id?: number;
    hasEns: boolean;
    address: string;
    name?: string | null;
    avatarUrl?: string | null;
};

export type StaleEntry = Awaited<
    ReturnType<typeof AddressENSRepository.getAllStaleEntries>
>[number];
