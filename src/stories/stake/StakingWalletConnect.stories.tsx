// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { StakingWalletConnect } from '../../components/stake/StakingWalletConnect';

export default {
    title: 'Stake/StakingWalletConnect',
    component: StakingWalletConnect,
    argTypes: {},
} as Meta<typeof StakingWalletConnect>;

type Story = StoryObj<typeof StakingWalletConnect>;

const Template: Story = {
    render: (args) => <StakingWalletConnect {...args} />,
};

export const Default: Story = {
    args: {
        onConnect: () => undefined,
    },
    ...Template,
};
