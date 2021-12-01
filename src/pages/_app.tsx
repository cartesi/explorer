// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { TrackingProvider } from '../contexts/tracker';
import FlagProvider, { IConfig } from '@unleash/proxy-client-react';
import dynamic from 'next/dynamic';
import ApolloContainer from '../components/ApolloContainer';
import theme from '../styles/theme';
import '@fontsource/rubik';

// configuration for Unleash Proxy, currently running at our Heroku account
const config: IConfig = {
    url: 'https://unleash.cartesi.io/proxy',
    clientKey:
        'bc1b71da9932b90ccd788d75203fb598c3640cabed3ccccdffd024f341a79d72',
    refreshInterval: 15,
    appName: 'explorer',
    environment: 'prod',
};

const Web3Container = dynamic(() => import('../components/Web3Container'), {
    ssr: false,
});

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <FlagProvider config={config}>
            <ChakraProvider theme={theme}>
                <Web3Container>
                    <TrackingProvider>
                        <ApolloContainer>
                            <Component {...pageProps} />
                        </ApolloContainer>
                    </TrackingProvider>
                </Web3Container>
            </ChakraProvider>
        </FlagProvider>
    );
};

export default App;
