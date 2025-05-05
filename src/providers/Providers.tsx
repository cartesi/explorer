'use client';

import ThemeProvider from './ThemeProvider';
import { GA4TrackerProvider } from '../contexts/ga4Tracker';
import TagManager from 'react-gtm-module';
import ApolloContainer from '../components/ApolloContainer';
import dynamic from 'next/dynamic';
import { FC, ReactNode, useEffect, useState } from 'react';
import EnsProvider from './EnsProvider';
import { AddressEns } from '../services/server/ens/types';

const FeatureFlagProvider = dynamic(() => import('../utils/featureFlags'), {
    ssr: false,
});

const Web3Container = dynamic(() => import('../components/Web3Container'), {
    ssr: false,
});

const getENSCachedData = async () => {
    const host = location.origin;
    const endpoint = `${host}/api/mainnet/ens`;
    try {
        const response = await fetch(endpoint, {
            signal: AbortSignal.timeout(3000),
        });
        return await response.json();
    } catch (reason) {
        console.error(
            `Fetching ENS cached data failed.\nReason: ${reason.message}`
        );
        return { data: [] };
    }
};

interface ProvidersProps {
    children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
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
        <ThemeProvider>
            <FeatureFlagProvider>
                <EnsProvider ensData={ensData}>
                    <Web3Container>
                        <GA4TrackerProvider>
                            <ApolloContainer>{children}</ApolloContainer>
                        </GA4TrackerProvider>
                    </Web3Container>
                </EnsProvider>
            </FeatureFlagProvider>
        </ThemeProvider>
    );
};

export default Providers;
