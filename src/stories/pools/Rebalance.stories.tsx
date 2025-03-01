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

import Rebalance from '../../components/pools/Rebalance';
import { ethers } from 'ethers';

export default {
    title: 'Pools/Rebalance',
    component: Rebalance,
    argTypes: {},
} as Meta<typeof Rebalance>;

type Story = StoryObj<typeof Rebalance>;

const Template: Story = {
    render: (args) => <Rebalance {...args} />,
};

const v = (n: string) => ethers.utils.parseUnits(n, 18);

export const Zero: Story = {
    args: {
        stake: v('0'),
        unstake: v('0'),
        withdraw: v('0'),
    },
    ...Template,
};

export const Stake: Story = {
    args: {
        stake: v('10000'),
        unstake: v('0'),
        withdraw: v('0'),
    },
    ...Template,
};

export const Unstake: Story = {
    args: {
        stake: v('0'),
        unstake: v('10000'),
        withdraw: v('0'),
    },
    ...Template,
};

export const Withdraw: Story = {
    args: {
        stake: v('0'),
        unstake: v('0'),
        withdraw: v('10000'),
    },
    ...Template,
};
