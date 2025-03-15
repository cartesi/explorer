'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { FC, ReactNode, useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import ApolloContainer from '../components/ApolloContainer';
import theme from '../styles/theme';

import { Fonts } from '../components/Fonts';
import PageHead from '../components/PageHead';
import { GA4TrackerProvider } from '../contexts/ga4Tracker';
import { ENSDataProvider } from '../services/ens';
import { AddressEns } from '../services/server/ens/types';

type ComponentType = FC<{ children: ReactNode }>;

const FeatureFlagProvider = dynamic(() => import('../utils/featureFlags'), {
    ssr: false,
}) as ComponentType;

const Web3Container = dynamic(() => import('../components/Web3Container'), {
    ssr: false,
}) as ComponentType;

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

const Providers = ({
    Component,
    pageProps,
}: AppProps & { Component: ComponentType }) => {
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
        <ChakraProvider theme={theme}>
            <PageHead
                title="Stake CTSI"
                description="Secure the Cartesi network and earn rewards"
            />
            <Fonts />
            <FeatureFlagProvider>
                <ENSDataProvider value={ensData}>
                    <Web3Container>
                        <GA4TrackerProvider>
                            <ApolloContainer>
                                <Component {...pageProps} />
                            </ApolloContainer>
                        </GA4TrackerProvider>
                    </Web3Container>
                </ENSDataProvider>
            </FeatureFlagProvider>
        </ChakraProvider>
    );
};

export default Providers;
