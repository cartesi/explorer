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
    FooterLink,
    Layout,
    PageBody,
    PageHeader,
    PagePanel,
} from '@explorer/ui';
import { FC, ReactNode } from 'react';
import { useRollupsFactory } from '../services/useRollupsFactory';

type Props = { children: ReactNode };

export const PageLayout: FC<Props> = ({ children }) => {
    const rollupsFactory = useRollupsFactory();
    const contracts: FooterContract[] = [
        {
            name: 'DApp Factory',
            address: rollupsFactory?.address,
        },
    ];

    const links: FooterLink[] = [
        {
            href: 'https://docs.cartesi.io/new-to-cartesi/overview/',
            label: 'The Blockchain OS',
        },
        {
            label: 'Rollups Overview',
            href: 'https://docs.cartesi.io/cartesi-rollups/overview/',
        },
    ];

    return (
        <Layout
            footerContracts={contracts}
            footerLinks={links}
            headerLinks={[{ href: '/', key: 'home', label: 'Home' }]}
        >
            {children}
        </Layout>
    );
};

export { PageBody, PageHeader, PagePanel };
