// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import '@rainbow-me/rainbowkit/styles.css';

import {
    darkTheme,
    lightTheme,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode, useMemo, useState } from 'react';
import { type Config, WagmiProvider } from 'wagmi';
import theme from '../styles/theme';
import { useColorMode } from './ui/color-mode';
import { WalletConnectionProvider } from './wallet';
import { appMetadata, getWagmiConfig } from './wallet/config';

interface Web3ContainerProps {
    children: ReactNode;
    /** Override the wagmi config (e.g. a mock connector in Storybook). */
    config?: Config;
}

const Web3Container: FC<Web3ContainerProps> = ({ children, config }) => {
    const { colorMode } = useColorMode();
    const [wagmiConfig] = useState(() => config ?? getWagmiConfig());
    const [queryClient] = useState(() => new QueryClient());
    const rainbowKitTheme = useMemo(
        () =>
            colorMode === 'dark'
                ? darkTheme({
                      accentColor: theme.token('colors.dark.primary'),
                      accentColorForeground: theme.token('colors.header'),
                      borderRadius: 'medium',
                      fontStack: 'system',
                  })
                : lightTheme({
                      accentColor: theme.token('colors.light.primary'),
                      accentColorForeground: theme.token('colors.white'),
                      borderRadius: 'medium',
                      fontStack: 'system',
                  }),
        [colorMode],
    );

    return (
        <WagmiProvider config={wagmiConfig} reconnectOnMount>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={rainbowKitTheme}
                    modalSize="wide"
                    appInfo={{ appName: appMetadata.name }}
                >
                    <WalletConnectionProvider>
                        {children}
                    </WalletConnectionProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default Web3Container;
