'use client';

import { Button, ChakraProvider, useColorModeValue } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import theme from '../styles/theme';
import { ENSDataProvider } from '../services/ens';
import { GA4TrackerProvider } from '../contexts/ga4Tracker';
import ApolloContainer from '../components/ApolloContainer';
import dynamic from 'next/dynamic';
import { Fonts } from '../components/Fonts';

const FeatureFlagProvider = dynamic(() => import('../utils/featureFlags'), {
    ssr: false,
});

const Web3Container = dynamic(() => import('../components/Web3Container'), {
    ssr: false,
});

const Card = () => {
    const colorScheme = useColorModeValue('teal', 'cyan');
    return (
        <Button
            data-testid="card-action-button"
            ml={{ base: 0, lg: 2 }}
            colorScheme={colorScheme}
            fontWeight={500}
            width="full"
            h={{ base: 12, lg: 14 }}
            w="16rem"
        >
            Hey there
        </Button>
    );
};

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <ChakraProvider theme={theme}>
            <ThemeProvider attribute="class" disableTransitionOnChange>
                <Fonts />
                <FeatureFlagProvider>
                    <Web3Container>
                        <GA4TrackerProvider>
                            <ApolloContainer>{props.children}</ApolloContainer>
                        </GA4TrackerProvider>
                    </Web3Container>
                </FeatureFlagProvider>
            </ThemeProvider>
        </ChakraProvider>
    );
}
