// Copyright (C) 2024 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { networks } from '@explorer/utils';
import { useWallet } from '@explorer/wallet';
import { ethers } from 'ethers';
import {
    createContext,
    FC,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

interface AddressEns {
    id: number;
    address: string;
    hasEns: boolean;
    name?: string;
    avatarUrl?: string;
}

interface ENSData extends AddressEns {
    resolving: boolean;
}

type ENSCacheData = Map<string, ENSData>;
const ENSDataContext = createContext<ENSCacheData>(new Map());

type GetENSInfoResult = Promise<AddressEns>;
type GetENSInfoSuccessResponse = { data: AddressEns };
type GetENSInfoError = {
    status: number;
    errorMessage: string;
};

type NetworkId = keyof typeof networks;

const getENSInfo = (address: string, chainId: number): GetENSInfoResult => {
    const chainName = networks[chainId as NetworkId] ?? 'mainnet';
    const host = location.origin;
    const endpoint = `${host}/api/${chainName}/ens/${address}`;

    return fetch(endpoint).then(async (response) => {
        if (response.status === 200) {
            const { data } =
                (await response.json()) as GetENSInfoSuccessResponse;
            return data;
        }

        const text = await response.text();
        const status = response.status;
        const errorMessage = `${status}: ${text ?? response.statusText}`;

        return Promise.reject({ status, errorMessage });
    });
};

const useCachedEntry = (address: string) => {
    const { chainId } = useWallet();
    const cachedData = useContext(ENSDataContext);
    const [entry, setEntry] = useState<Partial<ENSData>>({
        resolving: true,
        address,
    });

    useEffect(() => {
        const isValidAddress = ethers.utils.isAddress(address ?? '');

        if (!isValidAddress) {
            const entry = { address, hasEns: false, resolving: false };
            setEntry(entry);
            return;
        }

        const entry = cachedData.get(address);

        if (entry) {
            setEntry(entry);
        } else {
            const tempEntry = {
                address,
                resolving: true,
                hasEns: false,
                id: 0,
            };

            cachedData.set(address, tempEntry);

            getENSInfo(address, chainId ?? 1)
                .then((ensData) => {
                    const newEntry = { ...ensData, resolving: false };
                    cachedData.set(ensData.address, newEntry);
                    setEntry(newEntry);
                })
                .catch((error: GetENSInfoError) => {
                    console.error(error.errorMessage);
                    const newEntry = {
                        id: -1,
                        address,
                        hasEns: false,
                        resolving: false,
                    };
                    cachedData.set(address, newEntry);
                    setEntry(newEntry);
                });
        }
    }, [cachedData, address, chainId]);

    return entry;
};

export const ENSDataProvider: FC<{
    children: ReactNode;
    value: AddressEns[];
}> = ({ children, value }) => {
    const cachedData = useContext(ENSDataContext);

    useEffect(() => {
        if (value) {
            console.count('ens-cache-provider-rolling');
            value.forEach((ensDataEntry) => {
                cachedData.set(ensDataEntry.address, {
                    ...ensDataEntry,
                    resolving: false,
                });
            });
        }
    }, [cachedData, value]);

    return (
        <ENSDataContext.Provider value={cachedData}>
            {children}
        </ENSDataContext.Provider>
    );
};

export interface ENSEntry {
    address: string;
    name?: string;
    avatar?: string;
    url?: string;
    resolving: boolean;
}

/**
 * This hook provides a easy way to display ENS information about a ETH address.
 * @param address ETH address to be resolved
 * @returns ENSEntry with the address, and name if address can be resolved to a name
 */
export const useENS = (address: string): ENSEntry => {
    const cachedEnsEntry = useCachedEntry(address);
    return {
        address: cachedEnsEntry?.address ?? address,
        resolving: cachedEnsEntry?.resolving ?? false,
        avatar: cachedEnsEntry?.avatarUrl,
        name: cachedEnsEntry?.name,
    };
};