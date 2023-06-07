// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Layout, PageBody, PageHeader, PagePanel } from '@explorer/ui';
import React, { FC } from 'react';
import {
    useCartesiTokenContract,
    usePoSContract,
    useSimpleFaucetContract,
    useStakingContract,
    useStakingPoolFactoryContract,
    useWorkerManagerContract,
} from '../services/contracts';
import SyncStatus from './SyncStatus';

export { PageHeader, PagePanel, PageBody };

interface ComponentProps {
    children: React.ReactNode;
}

export const headerLinks = [
    {
        key: 'home',
        label: 'Home',
        href: '/',
    },
    {
        key: 'stake',
        label: 'Stake',
        href: '/stake',
    },
    {
        key: 'runners',
        label: 'Node Runners',
        href: '/node-runners',
    },
    {
        key: 'blocks',
        label: 'Blocks',
        href: '/blocks',
    },
];

export const footerLinks = [
    {
        label: 'Audit Report',
        href: 'https://github.com/cartesi/pos-dlib/raw/develop/Smart%20Contract%20Security%20Audit%20Report%20-%20Staking.pdf',
    },
    {
        label: 'CTSI Reserve Mining',
        href: 'https://cartesi.io/en/mine/',
    },
    {
        label: 'How to Run a Node',
        href: 'https://medium.com/cartesi/running-a-node-and-staking-42523863970e',
    },
    {
        label: 'FAQ',
        href: 'https://github.com/cartesi/noether/wiki/FAQ',
    },
];

const PageLayout: FC<ComponentProps> = ({ children }) => {
    const pos = usePoSContract();
    const token = useCartesiTokenContract();
    const faucet = useSimpleFaucetContract();
    const staking = useStakingContract();
    const workerManager = useWorkerManagerContract();
    const poolFactory = useStakingPoolFactoryContract();

    const contracts = [
        {
            name: 'Token',
            address: token?.address,
        },
        {
            name: 'Faucet',
            address: faucet?.address,
        },
        {
            name: 'PoS',
            address: pos?.address,
        },
        {
            name: 'Staking',
            address: staking?.address,
        },
        {
            name: 'Worker Manager',
            address: workerManager?.address,
        },
        {
            name: 'Pool Factory',
            address: poolFactory?.address,
        },
    ];

    return (
        <Layout
            headerLinks={headerLinks}
            footerContracts={contracts}
            footerLinks={footerLinks}
        >
            <>
                <SyncStatus />
                {children}
            </>
        </Layout>
    );
};

export default PageLayout;
