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
import { ReactNode, FC } from 'react';
import { Spinner, VStack } from '@chakra-ui/react';

const url = process.env.NEXT_PUBLIC_UNLEASH_PROXY_HOST;
const clientKey = process.env.NEXT_PUBLIC_UNLEASH_PROXY_CLIENT_KEY;

// configuration for Unleash Proxy
export const config: IConfig = {
    url,
    clientKey,
    refreshInterval: 15,
    appName: 'explorer',
    environment: 'prod',
};

export interface Props {
    children: ReactNode;
}

export const WhenReady: FC<Props> = ({ children }) => {
    const { flagsReady } = useFlagsStatus();
    if (!flagsReady) {
        return (
            <VStack
                h="100%"
                w="100%"
                justifyContent="center"
                style={{ position: 'fixed' }}
                data-testid="when-ready-spinner"
            >
                <Spinner size="xl" />
            </VStack>
        );
    }

    return <>{children}</>;
};

/**
 * Handy provider with our default configuration already set. Just wrap your
 * React component(s) on it, and you are set with feature-flags (currently using unleash)
 * @param Props
 * @returns JSX.Element
 */
const FeatureFlagProvider: FC<Props> = ({ children }) => {
    return (
        <FlagProvider config={config}>
            <WhenReady>{children}</WhenReady>
        </FlagProvider>
    );
};

export default FeatureFlagProvider;
