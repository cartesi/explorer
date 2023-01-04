// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import TagManager from 'react-gtm-module';
import ApolloContainer from '../components/ApolloContainer';
import theme from '../styles/theme';
import { Fonts } from '../components/Fonts';
import { GA4TrackerProvider } from '../contexts/ga4Tracker';
import { useRouter } from 'next/router';

const FeatureFlagProvider = dynamic(() => import('../utils/featureFlags'), {
    ssr: false,
});

const Web3Container = dynamic(() => import('../components/Web3Container'), {
    ssr: false,
});

const App = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();
    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            TagManager.initialize({
                gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
            });
        }
        const redirect = process.env.NEXT_PUBLIC_ROLLUPS_ONLY;
        if (redirect === 'true') router.replace('/rollups');
    }, []);

    return (
        <ChakraProvider theme={theme}>
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
