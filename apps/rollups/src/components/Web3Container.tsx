// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { WalletConnectionProvider } from '@explorer/wallet';
import networks from '../services/useNetwork';

const ROLLUPS_PUBLIC_URL = process.env.NEXT_PUBLIC_ROLLUPS_EXPLORER_URL;

export const chainIds = Object.keys(networks).map(
    (key) => networks[key].chain.id
);

export const appMetaData = {
    name: 'Cartesi Rollups Explorer',
    description: 'A place where you can view instantiated DApps.',
    explore: ROLLUPS_PUBLIC_URL,
};

const Web3Container = ({ children }) => (
    <WalletConnectionProvider chainIds={chainIds} appMetaData={appMetaData}>
        {children}
    </WalletConnectionProvider>
);

export default Web3Container;
