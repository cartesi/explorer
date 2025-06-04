// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { networks } from '../utils/networks';
import { WalletConnectionProvider } from './wallet';
import { FC, ReactNode } from 'react';

interface Web3ContainerProps {
    children: ReactNode;
}

const Web3Container: FC<Web3ContainerProps> = ({ children }) => {
    const chainIds = Object.keys(networks).map(
        (key) => `0x${Number(key).toString(16)}`
    );
    const appMetaData = {
        name: 'Cartesi Blockchain Explorer',
        description: 'A place where you can stake your CTSI and much more.',
        explore: 'https://explorer.cartesi.io',
    };

    return (
        <WalletConnectionProvider chainIds={chainIds} appMetaData={appMetaData}>
            {children}
        </WalletConnectionProvider>
    );
};

export default Web3Container;
