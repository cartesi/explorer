// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3ConnectionProvider } from '../contexts/Web3Connection';

const Web3Container = ({ children }) => {
    const getLibrary = (provider: any) => {
        return new Web3Provider(provider, 'any');
    };

    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ConnectionProvider>{children}</Web3ConnectionProvider>
        </Web3ReactProvider>
    );
};

export default Web3Container;
