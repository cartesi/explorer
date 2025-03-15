'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import theme from '../styles/theme';
import dynamic from 'next/dynamic';
import TagManager from 'react-gtm-module';
import { GA4TrackerProvider } from '../contexts/ga4Tracker';
import { ENSDataProvider } from '../services/ens';
import { AddressEns } from '../services/server/ens/types';
import ApolloContainer from '../components/ApolloContainer';

const FeatureFlagProvider = dynamic(() => import('../utils/featureFlags'), {
    ssr: false,
});

const Web3Container = dynamic(() => import('../components/Web3Container'), {
    ssr: false,
});

const getENSCachedData = () => {
    const host = location.origin;
    const endpoint = `${host}/api/mainnet/ens`;
    return fetch(endpoint)
        .then((response) => response.json())
        .catch((reason) => {
            console.error(
                `Fetching ENS cached data failed.\nReason: ${reason.message}`
            );
            return { data: [] };
        });
};

export default function RootLayout(props: { children: ReactNode }) {
    const [ensData, setEnsData] = useState<AddressEns[]>([]);

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            TagManager.initialize({
                gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
            });
        }

        (async () => {
            const { data }: { data: AddressEns[] } = await getENSCachedData();
            setEnsData(data);
        })();
    }, []);

    return (
        <ChakraProvider value={theme}>
            <ThemeProvider attribute="class" disableTransitionOnChange>
                <FeatureFlagProvider>
                    <ENSDataProvider value={ensData}>
                        <Web3Container>
                            <GA4TrackerProvider>
                                <ApolloContainer>
                                    {props.children}
                                </ApolloContainer>
                            </GA4TrackerProvider>
                        </Web3Container>
                    </ENSDataProvider>
                </FeatureFlagProvider>
            </ThemeProvider>
        </ChakraProvider>
    );
}
