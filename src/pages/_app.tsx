// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { AppProps } from 'next/app';
import 'antd/dist/antd.css';
import dynamic from 'next/dynamic';
import { DataProvider } from '../components/DataContext';

const Web3Container = dynamic(() => import('../components/Web3Container'), {
    ssr: false,
});

export default ({ Component, pageProps }: AppProps) => {
    return (
        <Web3Container>
            <DataProvider>
                <Component {...pageProps} />
            </DataProvider>
        </Web3Container>
    );
};
