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

import UserStake from '../../components/pools/UserStake';
import { BigNumber, ethers } from 'ethers';

export default {
    title: 'Pools/User Stake',
    component: UserStake,
    argTypes: {},
} as ComponentMeta<typeof UserStake>;

const Template: ComponentStory<typeof UserStake> = (args) => (
    <UserStake {...args} />
);

const v = (n: string) => ethers.utils.parseUnits(n, 18);

export const ZeroAllowance = Template.bind({});
ZeroAllowance.args = {
    allowance: BigNumber.from(0),
    paused: false,
    shares: v('1200'),
    staked: v('1200'),
    released: v('0'),
    withdrawBalance: v('0'),
};

export const With1000Allowance = Template.bind({});
With1000Allowance.args = {
    allowance: ethers.utils.parseUnits('1000', 18),
    paused: false,
    shares: v('1200'),
    staked: v('1200'),
    released: v('0'),
    withdrawBalance: v('0'),
};

export const WithdrawNotAvailable = Template.bind({});
WithdrawNotAvailable.args = {
    allowance: ethers.utils.parseUnits('1000', 18),
    paused: false,
    shares: v('1200'),
    staked: v('1200'),
    released: v('500'),
    withdrawBalance: v('0'),
};

export const Withdraw = Template.bind({});
Withdraw.args = {
    allowance: ethers.utils.parseUnits('1000', 18),
    paused: false,
    shares: v('1200'),
    staked: v('1200'),
    released: v('500'),
    withdrawBalance: v('500'),
};

export const Paused = Template.bind({});
Paused.args = {
    allowance: ethers.utils.parseUnits('1000', 18),
    paused: true,
    shares: v('1200'),
    staked: v('1200'),
    released: v('0'),
    withdrawBalance: v('0'),
};
