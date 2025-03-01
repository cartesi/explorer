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
import { StakingDashboard } from '../../components/stake/StakingDashboard';
import { BigNumber } from 'ethers';

const defaultValue = '1000000000000000000';

export default {
    title: 'Stake/StakingDashboard',
    component: StakingDashboard,
    argTypes: {},
} as Meta<typeof StakingDashboard>;

type Story = StoryObj<typeof StakingDashboard>;

const Template: Story = {
    render: (args) => <StakingDashboard {...args} />,
};

export const Default: Story = {
    args: {
        balance: BigNumber.from(defaultValue),
        allowance: BigNumber.from(defaultValue),
        userETHBalance: BigNumber.from(defaultValue),
        onApprove: () => undefined,
    },
    ...Template,
};
