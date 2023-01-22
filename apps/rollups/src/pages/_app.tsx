// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ChakraProvider } from '@chakra-ui/react';
import { Fonts, theme } from '@explorer/ui';
import { AppProps } from 'next/app';
import { ReactNode } from 'react';
import GraphQLProvider from '../containers/rollups/GraphQLProvider';
import { useNetwork } from '../services/useNetwork';
import FeatureFlagProvider from '../components/FeatureFlagProvider';
import Web3Container from '../components/Web3Container';

const GraphProvider = ({ children }: { children: ReactNode }) => {
    const network = useNetwork();
    return (
        <GraphQLProvider chainId={network?.chainId}>{children}</GraphQLProvider>
    );
};

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <ChakraProvider theme={theme}>
            <Fonts />
            <FeatureFlagProvider>
                <Web3Container>
                    <GraphProvider>
                        <Component {...pageProps} />
                    </GraphProvider>
                </Web3Container>
            </FeatureFlagProvider>
        </ChakraProvider>
    );
};

export default App;
