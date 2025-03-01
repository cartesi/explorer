// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Meta, StoryObj } from '@storybook/react';
import AccountMobile from '../../components/header/AccountMobile';
import { WalletConnectionContext } from '../../components/wallet';

export default {
    title: 'Header/AccountMobile',
    component: AccountMobile,
    argTypes: {},
} as Meta<typeof AccountMobile>;

const initialContextState = {
    active: true,
    activate: async () => Promise.resolve(),
    deactivate: () => Promise.resolve(),
    account: '0x491604c0FDF08347Dd1fa4Ee062a822A5DD06B5D',
    chainId: 1,
};

type Story = StoryObj<typeof AccountMobile>;

const Template: Story = {
    render: (args) => (
        <WalletConnectionContext.Provider value={initialContextState}>
            <AccountMobile {...args} />
        </WalletConnectionContext.Provider>
    ),
};

export const Default: Story = {
    args: {
        onApprove: () => undefined,
    },
    ...Template,
};
