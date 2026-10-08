// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';
import type { Connector } from 'wagmi';

/**
 * Transitional bridge kept while the services layer still speaks ethers v5.
 * Wraps the connector's EIP-1193 provider once per connection, with the 'any'
 * network so ethers follows chain changes without a new instance (the contract
 * hooks re-instantiate whenever `library` changes). Removed once every
 * consumer is on viem.
 */
export const toWeb3Provider = (provider: ExternalProvider): Web3Provider =>
    new Web3Provider(provider, 'any');

export const useEthersLibrary = (
    connector?: Connector,
): Web3Provider | undefined => {
    const [library, setLibrary] = useState<Web3Provider>();
    const connectorUid = connector?.uid;

    useEffect(() => {
        if (!connector) {
            setLibrary(undefined);
            return;
        }
        let cancelled = false;
        connector
            .getProvider()
            .then((provider) => {
                if (!cancelled && provider) {
                    setLibrary(toWeb3Provider(provider as ExternalProvider));
                }
            })
            .catch(() => {
                if (!cancelled) setLibrary(undefined);
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectorUid]);

    return library;
};
