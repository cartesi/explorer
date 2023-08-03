// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    FooterContract,
    Layout,
    PageBody,
    PageHeader,
    PagePanel,
} from '@explorer/ui';
import { FC, ReactNode } from 'react';
import { useRollupsFactory } from '../services/useRollupsFactory';

export interface Props {
    children: ReactNode;
}

export const headerLinks = [{ href: '/', key: 'home', label: 'Home' }];

export const footerLinks = [
    {
        label: 'The Blockchain OS',
        href: 'https://docs.cartesi.io/new-to-cartesi/overview/',
    },
    {
        label: 'Rollups Overview',
        href: 'https://docs.cartesi.io/cartesi-rollups/overview/',
    },
];

export const footerSupport = [
    {
        label: 'About Us',
        href: 'https://cartesi.io/about/',
    },
    {
        label: 'Docs',
        href: 'https://docs.cartesi.io/',
    },
];

export const footerGeneral = [
    {
        label: 'About Us',
        href: 'https://cartesi.io/about/',
    },
    {
        label: 'Docs',
        href: 'https://docs.cartesi.io/',
    },
];

export const PageLayout: FC<Props> = ({ children }) => {
    const rollupsFactory = useRollupsFactory();
    const contracts: FooterContract[] = [
        {
            name: 'DApp Factory',
            address: rollupsFactory?.address,
        },
    ];

    return (
        <Layout
            headerLinks={headerLinks}
            footerLinks={footerLinks}
            footerSupport={footerSupport}
            footerGeneral={footerGeneral}
            footerContracts={contracts}
        >
            {children}
        </Layout>
    );
};

export { PageBody, PageHeader, PagePanel };
