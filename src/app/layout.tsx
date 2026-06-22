import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { FC, ReactNode } from 'react';
import Providers from '../providers/Providers';
import { getTinyGraphsServiceUrl } from '../utils/tinygraph';

export const metadata: Metadata = {
    title: {
        template: '%s | Stake CTSI',
        default: 'Stake CTSI | Secure the Cartesi network and earn rewards',
    },
    description: 'Secure the Cartesi network and earn rewards',
    icons: {
        icon: '/favicon.ico',
    },
};

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = async ({ children }) => {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href={getTinyGraphsServiceUrl()} />
            </head>
            <body>
                <Providers>{children}</Providers>
                <SpeedInsights />
            </body>
        </html>
    );
};

export default Layout;
