// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ComponentMeta, ComponentStory } from '@storybook/react';

// import Footer from '../components/Footer';
import { Footer } from '@explorer/ui';
import { WalletConnectionContext } from '@explorer/wallet';

export default {
    title: 'Footer',
    component: Footer,
    argTypes: {},
} as ComponentMeta<typeof Footer>;

const initialContextState = {
    active: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    activate: async () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    deactivate: () => {},
};

const Template: ComponentStory<typeof Footer> = (args) => {
    const hasContracts = args.contracts.length > 0;
    const chainId = hasContracts ? 1 : undefined;
    return (
        <WalletConnectionContext.Provider
            value={{ chainId, ...initialContextState }}
        >
            <Footer {...args} />
        </WalletConnectionContext.Provider>
    );
};

const links = [
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

export const Standard = Template.bind({});
Standard.args = {
    links,
    contracts,
};

export const NotConnected = Template.bind({});
NotConnected.args = {
    links,
    contracts: [],
};
