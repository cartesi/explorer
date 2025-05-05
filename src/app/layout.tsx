import { FC, ReactNode } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from '../providers/Providers';
import { Metadata } from 'next';

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
                <link rel="preconnect" href="https://tinygraphs.cartesi.io" />
            </head>
            <body>
                <Providers>{children}</Providers>
                <SpeedInsights />
            </body>
        </html>
    );
};

export default Layout;
