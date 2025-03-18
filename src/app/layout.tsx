import React, { ReactNode } from 'react';
import { Metadata } from 'next';
import Provider from '../providers/provider';

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

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://tinygraphs.cartesi.io" />
            </head>
            <body>
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}
