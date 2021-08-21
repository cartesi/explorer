// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Rebalance from '../../components/pools/Rebalance';
import { ethers } from 'ethers';

export default {
    title: 'Pools/Rebalance',
    component: Rebalance,
    argTypes: {},
} as ComponentMeta<typeof Rebalance>;

const Template: ComponentStory<typeof Rebalance> = (args) => (
    <Rebalance {...args} />
);

const v = (n: string) => ethers.utils.parseUnits(n, 18);

export const Zero = Template.bind({});
Zero.args = {
    stake: v('0'),
    unstake: v('0'),
    withdraw: v('0'),
};

export const Stake = Template.bind({});
Stake.args = {
    stake: v('10000'),
    unstake: v('0'),
    withdraw: v('0'),
};

export const Unstake = Template.bind({});
Unstake.args = {
    stake: v('0'),
    unstake: v('10000'),
    withdraw: v('0'),
};

export const Withdraw = Template.bind({});
Withdraw.args = {
    stake: v('0'),
    unstake: v('0'),
    withdraw: v('10000'),
};
