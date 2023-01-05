// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '@explorer/wallet';

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
    const { library } = useWallet();
    const [entry, setEntry] = useState<ENSEntry>({ address, resolving: true });
    useEffect(() => {
        if (library) {
            const resolve = async (address: string): Promise<ENSEntry> => {
                // convert address to checksum address
                try {
                    address = ethers.utils.getAddress(address);
                } catch (e) {
                    console.warn(`error resolving address ${address}`);
                    return { address, resolving: false };
                }

                if (!library.network?.ensAddress) {
                    // network does not support ENS
                    return { address, resolving: false };
                }

                // do a reverse lookup
                const name = await library.lookupAddress(address);

                console.log(`reverse lookup of ${address} resolved to ${name}`);
                if (name) {
                    // name found, now do a forward lookup
                    const resolver = await library.getResolver(name);
                    const ethAddress = await resolver?.getAddress();
                    console.log(
                        `forward lookup of ${name} resolved to ${ethAddress}`
                    );

                    // we need to check if the forward resolution matches the reverse
                    if (ethAddress === address) {
                        const avatar = await resolver?.getText('avatar');
                        const url = await resolver?.getText('url');
                        console.log(`${name}: avatar(${avatar}) url(${url})`);
                        return {
                            address,
                            name,
                            avatar,
                            url,
                            resolving: false,
                        };
                    }
                }
                return { address, resolving: false };
            };

            resolve(address).then(setEntry);
        }
    }, [address, library, library?.network]);
    return entry;
};
