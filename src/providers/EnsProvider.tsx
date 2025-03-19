// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { ENSDataProvider } from '../services/ens';
import { AddressEns } from '../services/server/ens/types';

const getENSCachedData = async () => {
    const endpoint = `${location.origin}/api/mainnet/ens`;
    try {
        const response = await fetch(endpoint);
        return await response.json();
    } catch (reason) {
        console.error(
            `Fetching ENS cached data failed.\nReason: ${reason.message}`
        );
        return { data: [] };
    }
};

interface EnsProviderProps {
    children: ReactNode;
}

const EnsProvider: FC<EnsProviderProps> = ({ children }) => {
    const [ensData, setEnsData] = useState<AddressEns[]>([]);

    useEffect(() => {
        (async () => {
            const { data }: { data: AddressEns[] } = await getENSCachedData();
            setEnsData(data);
        })();
    }, []);

    return <ENSDataProvider value={ensData}>{children}</ENSDataProvider>;
};

export default EnsProvider;
