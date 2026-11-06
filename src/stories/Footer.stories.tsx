// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Meta, StoryObj } from '@storybook/nextjs-vite';
import Footer from '../components/Footer';
import {
    footerGeneral,
    footerLinks,
    footerSupport,
} from '../components/Layout';
import { WalletConnectionContext } from '../components/wallet';

export default {
    title: 'Footer',
    component: Footer,
    argTypes: {},
} as Meta<typeof Footer>;

type Story = StoryObj<typeof Footer>;

const withChain = (chainId?: number): Story['render'] => {
    const FooterWithChain: Story['render'] = (args) => (
        <WalletConnectionContext.Provider
            value={{
                chainId,
                active: chainId !== undefined,
                activate: async () => Promise.resolve(),
                deactivate: () => Promise.resolve(),
            }}
        >
            <Footer {...args} />
        </WalletConnectionContext.Provider>
    );
    return FooterWithChain;
};

const contracts = [
    {
        name: 'Token',
        address: '0x491604c0FDF08347Dd1fa4Ee062a822A5DD06B5D',
    },
    {
        name: 'PoS',
        address: '0x20516624DE3cbE267a514fE91c31477369524fcE',
    },
];

const args = {
    links: footerLinks,
    support: footerSupport,
    general: footerGeneral,
    contracts,
};

export const Standard: Story = {
    args,
    render: withChain(1),
};

/** Disconnected wallets see the mainnet contracts, the explorer's default network. */
export const NotConnected: Story = {
    args,
    render: withChain(),
};

/** Connected to a chain without deployments: the Contracts title stays, without rows. */
export const NoContracts: Story = {
    args: { ...args, contracts: [] },
    render: withChain(1),
};
