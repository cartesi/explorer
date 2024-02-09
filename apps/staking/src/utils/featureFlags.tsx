// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import FlagProvider, { IConfig } from '@unleash/proxy-client-react';
import { ReactNode } from 'react';

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

type Props = {
    children: ReactNode;
};

/**
 * Handy provider with our default configuration already set. Just wrap your
 * React component(s) on it and you are set with feature-flags (currently using unleash)
 * @param Props
 * @returns JSX.Element
 */
const FeatureFlagProvider = ({ children }: Props) => {
    return <FlagProvider config={config}>{children}</FlagProvider>;
};

export default FeatureFlagProvider;
