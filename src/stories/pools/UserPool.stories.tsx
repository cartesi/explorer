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

import UserPool from '../../components/pools/UserPool';
import { BigNumber, ethers } from 'ethers';

export default {
    title: 'Pools/User Pool',
    component: UserPool,
    argTypes: {},
} as ComponentMeta<typeof UserPool>;

const Template: ComponentStory<typeof UserPool> = (args) => (
    <UserPool {...args} />
);

const v = (n: string) => ethers.utils.parseUnits(n, 18);

export const ZeroAllowance = Template.bind({});
ZeroAllowance.args = {
    balance: ethers.utils.parseUnits('90200', 18),
    allowance: BigNumber.from(0),
    paused: false,
    userBalance: v('0'),
    shares: v('1200'),
    staked: v('1200'),
    withdrawBalance: v('0'),
};

export const With1000Allowance = Template.bind({});
With1000Allowance.args = {
    balance: ethers.utils.parseUnits('90200', 18),
    allowance: ethers.utils.parseUnits('1000', 18),
    paused: false,
    userBalance: v('0'),
    shares: v('1200'),
    staked: v('1200'),
    withdrawBalance: v('0'),
};

export const WithdrawNotAvailable = Template.bind({});
WithdrawNotAvailable.args = {
    balance: ethers.utils.parseUnits('90200', 18),
    allowance: ethers.utils.parseUnits('1000', 18),
    paused: false,
    userBalance: v('500'),
    shares: v('1200'),
    staked: v('1200'),
    withdrawBalance: v('0'),
};

export const Withdraw = Template.bind({});
Withdraw.args = {
    balance: ethers.utils.parseUnits('90200', 18),
    allowance: ethers.utils.parseUnits('1000', 18),
    paused: false,
    userBalance: v('500'),
    shares: v('1200'),
    staked: v('1200'),
    withdrawBalance: v('500'),
};

export const Paused = Template.bind({});
Paused.args = {
    balance: ethers.utils.parseUnits('90200', 18),
    allowance: ethers.utils.parseUnits('1000', 18),
    paused: true,
    userBalance: v('0'),
    shares: v('1200'),
    staked: v('1200'),
    withdrawBalance: v('0'),
};
