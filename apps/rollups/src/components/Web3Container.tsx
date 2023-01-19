// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { WalletConnectionProvider } from '@explorer/wallet';
import networks from '../services/useNetwork';

const Web3Container = ({ children }) => {
    const chainIds = Object.keys(networks).map((key) => networks[key].chain.id);
    const appMetaData = {
        name: 'Cartesi Blockchain Rollups',
        description: 'A place where you can view instantiated DApps.',
    };

    return (
        <WalletConnectionProvider chainIds={chainIds} appMetaData={appMetaData}>
            {children}
        </WalletConnectionProvider>
    );
};

export default Web3Container;
