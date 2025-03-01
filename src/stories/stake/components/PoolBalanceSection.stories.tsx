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
import { PoolBalanceSection } from '../../../components/stake/components/PoolBalanceSection';
import { BigNumber } from 'ethers';

const defaultValue = '10000000000000000000000000000';

export default {
    title: 'Stake/Components/PoolBalanceSection',
    component: PoolBalanceSection,
    argTypes: {},
} as Meta<typeof PoolBalanceSection>;

type Story = StoryObj<typeof PoolBalanceSection>;

const Template: Story = {
    render: (args) => <PoolBalanceSection {...args} />,
};

export const Default: Story = {
    args: {
        userPoolBalance: BigNumber.from(defaultValue),
        isPoolBalanceLocked: false,
        onStakeClick: () => undefined,
        onWithdrawClick: () => undefined,
    },
    ...Template,
};

export const PoolBalanceLocked: Story = {
    args: {
        ...Default.args,
        isPoolBalanceLocked: true,
    },
    ...Template,
};

export const ZeroUserPoolBalance: Story = {
    args: {
        ...Default.args,
        userPoolBalance: BigNumber.from(0),
    },
    ...Template,
};
