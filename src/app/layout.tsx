import { FC, ReactNode } from 'react';
import Providers from '../providers/Providers';
import { Metadata } from 'next';
import { getEnsData } from '../utils/getEnsData';
import AddressENSService from '../services/server/ens/AddressENSService';

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
    const ensData = await getEnsData();

    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://tinygraphs.cartesi.io" />
            </head>
            <body>
                <Providers ensData={ensData}>{children}</Providers>
            </body>
        </html>
    );
};

export default Layout;
