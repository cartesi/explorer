// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Meta, StoryObj } from '@storybook/react';
import { ConnectWallet } from '../../components/header';
import { UnsupportedNetworkError } from '../../components/wallet';

const defaultWallet = {
    active: false,
    activate: () => Promise.resolve(),
    deactivate: () => Promise.resolve(),
};

export default {
    title: 'Header/ConnectWallet',
    component: ConnectWallet,
    argTypes: {},
} as Meta<typeof ConnectWallet>;

type Story = StoryObj<typeof ConnectWallet>;

const Template: Story = {
    render: (args) => <ConnectWallet {...args} />,
};

export const ConnectToWallet: Story = {
    args: {
        wallet: defaultWallet,
    },
    ...Template,
};

export const UnsupportedNetwork: Story = {
    args: {
        wallet: {
            ...defaultWallet,
            error: new UnsupportedNetworkError(1),
        },
    },
    ...Template,
};
