import FlagProvider, { IConfig } from '@unleash/proxy-client-react';
import { ReactNode } from 'react';

// configuration for Unleash Proxy, currently running at our Heroku account
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

/**
 * Handy provider with our default configuration already set. Just wrap your
 * React component(s) on it and you are set with feature-flags (currently using unleash)
 * @param Props
 * @returns JSX.Element
 */
export const FeatureFlagProvider = ({ children }: Props) => (
    <FlagProvider config={config}>{children}</FlagProvider>
);
