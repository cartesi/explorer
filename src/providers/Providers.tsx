'use client';

import ThemeProvider from './ThemeProvider';
import ApolloContainer from '../components/ApolloContainer';
import dynamic from 'next/dynamic';
import { FC, ReactNode } from 'react';
import EnsProvider from './EnsProvider';
import TrackerProvider from './TrackerProvider';

const Web3Container = dynamic(() => import('../components/Web3Container'), {
    ssr: false,
});

interface ProvidersProps {
    children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
    return (
        <ThemeProvider>
            <EnsProvider>
                <Web3Container>
                    <TrackerProvider>
                        <ApolloContainer>{children}</ApolloContainer>
                    </TrackerProvider>
                </Web3Container>
            </EnsProvider>
        </ThemeProvider>
    );
};

export default Providers;
