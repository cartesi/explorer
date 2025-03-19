'use client';

import ThemeProvider from './ThemeProvider';
import { GA4TrackerProvider } from '../contexts/ga4Tracker';
import ApolloContainer from '../components/ApolloContainer';
import dynamic from 'next/dynamic';
import { FC, ReactNode } from 'react';
import EnsProvider from './EnsProvider';

const FeatureFlagProvider = dynamic(() => import('../utils/featureFlags'), {
    ssr: false,
});

const Web3Container = dynamic(() => import('../components/Web3Container'), {
    ssr: false,
});

interface ProvidersProps {
    children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
    return (
        <ThemeProvider>
            <FeatureFlagProvider>
                <EnsProvider>
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
