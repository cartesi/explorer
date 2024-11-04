// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@explorer/ui';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { FC, useEffect, ReactNode } from 'react';
import TagManager from 'react-gtm-module';
import ApolloContainer from '../components/ApolloContainer';

import { Fonts } from '@explorer/ui';
import { GA4TrackerProvider } from '../contexts/ga4Tracker';
import PageHead from '../components/PageHead';

type ComponentType = FC<{ children: ReactNode }>;

const FeatureFlagProvider = dynamic(() => import('../utils/featureFlags'), {
    ssr: false,
}) as ComponentType;

const Web3Container = dynamic(() => import('../components/Web3Container'), {
    ssr: false,
}) as ComponentType;

const App = ({
    Component,
    pageProps,
}: AppProps & { Component: ComponentType }) => {
    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            TagManager.initialize({
                gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
            });
        }
    }, []);

    return (
        <ChakraProvider theme={theme}>
            <PageHead
                title="Stake CTSI"
                description="Secure the Cartesi network and earn rewards"
            />
            <Fonts />
            <FeatureFlagProvider>
                <Web3Container>
                    <GA4TrackerProvider>
                        <ApolloContainer>
                            <Component {...pageProps} />
                        </ApolloContainer>
                    </GA4TrackerProvider>
                </Web3Container>
            </FeatureFlagProvider>
        </ChakraProvider>
    );
};

export default App;
