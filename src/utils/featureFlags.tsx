// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import FlagProvider, {
    IConfig,
    useFlagsStatus,
} from '@unleash/proxy-client-react';
import { ReactNode } from 'react';
import { Spinner, VStack } from '@chakra-ui/react';

// configuration for Unleash Proxy
export const config: IConfig = {
    url: 'https://unleash.cartesi.io/proxy',
    clientKey:
        'bc1b71da9932b90ccd788d75203fb598c3640cabed3ccccdffd024f341a79d72',
    refreshInterval: 15,
    appName: 'explorer',
    environment: 'prod',
};

type Props = {
    children: ReactNode;
};

const WhenReady = ({ children }: Props) => {
    const { flagsReady } = useFlagsStatus();
    if (!flagsReady) {
        return (
            <VStack h="100%" w="100%" justifyContent="center">
                <Spinner size="xl" />
            </VStack>
        );
    }

    return <>{children}</>;
};
/**
 * Handy provider with our default configuration already set. Just wrap your
 * React component(s) on it and you are set with feature-flags (currently using unleash)
 * @param Props
 * @returns JSX.Element
 */
export const FeatureFlagProvider = ({ children }: Props) => {
    return (
        <FlagProvider config={config}>
            <WhenReady>{children}</WhenReady>
        </FlagProvider>
    );
};
