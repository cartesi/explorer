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

import BalancePanel from '../../components/pools/BalancePanel';
import { ethers } from 'ethers';

export default {
    title: 'Pools/Balance Panel',
    component: BalancePanel,
    argTypes: {},
} as ComponentMeta<typeof BalancePanel>;

const Template: ComponentStory<typeof BalancePanel> = (args) => (
    <BalancePanel {...args} />
);

const v = (n: string) => ethers.utils.parseUnits(n, 18);

export const Balanced = Template.bind({});
Balanced.args = {
    amount: v('1200000'),
    pool: v('0'),
    poolRequiredLiquidity: v('0'),
    stake: v('0'),
    unstake: v('0'),
    withdraw: v('0'),
    stakingMature: v('1200000'),
    stakingMaturing: v('0'),
    stakingReleasing: v('0'),
    stakingReleased: v('0'),
};

export const Stake30k = Template.bind({});
Stake30k.args = {
    amount: v('1230000'),
    pool: v('30000'),
    poolRequiredLiquidity: v('0'),
    stake: v('30000'),
    unstake: v('0'),
    withdraw: v('0'),
    stakingMature: v('1200000'),
    stakingMaturing: v('0'),
    stakingReleasing: v('0'),
    stakingReleased: v('0'),
};

export const Stake30kMaturing = Template.bind({});
Stake30kMaturing.args = {
    amount: v('1230000'),
    pool: v('0'),
    poolRequiredLiquidity: v('0'),
    stake: v('0'),
    unstake: v('0'),
    withdraw: v('0'),
    stakingMature: v('1200000'),
    stakingMaturing: v('30000'),
    stakingReleasing: v('0'),
    stakingReleased: v('0'),
};

export const Stake30kMature = Template.bind({});
Stake30kMature.args = {
    amount: v('1230000'),
    pool: v('0'),
    poolRequiredLiquidity: v('0'),
    stake: v('0'),
    unstake: v('0'),
    withdraw: v('0'),
    stakingMature: v('1230000'),
    stakingMaturing: v('0'),
    stakingReleasing: v('0'),
    stakingReleased: v('0'),
};

export const Unstake20k = Template.bind({});
Unstake20k.args = {
    amount: v('1210000'),
    pool: v('0'),
    poolRequiredLiquidity: v('20000'),
    stake: v('0'),
    unstake: v('20000'),
    withdraw: v('0'),
    stakingMature: v('1230000'),
    stakingMaturing: v('0'),
    stakingReleasing: v('0'),
    stakingReleased: v('0'),
};

export const Unstake20kMaturing = Template.bind({});
Unstake20kMaturing.args = {
    amount: v('1210000'),
    pool: v('0'),
    poolRequiredLiquidity: v('20000'),
    stake: v('0'),
    unstake: v('0'),
    withdraw: v('0'),
    stakingMature: v('1210000'),
    stakingMaturing: v('0'),
    stakingReleasing: v('20000'),
    stakingReleased: v('0'),
};

export const Unstake20kReleased = Template.bind({});
Unstake20kReleased.args = {
    amount: v('1210000'),
    pool: v('0'),
    poolRequiredLiquidity: v('20000'),
    stake: v('0'),
    unstake: v('0'),
    withdraw: v('20000'),
    stakingMature: v('1210000'),
    stakingMaturing: v('0'),
    stakingReleasing: v('0'),
    stakingReleased: v('20000'),
};

export const Unstake20kWithdraw = Template.bind({});
Unstake20kWithdraw.args = {
    amount: v('1210000'),
    pool: v('20000'),
    poolRequiredLiquidity: v('20000'),
    stake: v('0'),
    unstake: v('0'),
    withdraw: v('0'),
    stakingMature: v('1210000'),
    stakingMaturing: v('0'),
    stakingReleasing: v('0'),
    stakingReleased: v('0'),
};

export const Withdraw20k = Template.bind({});
Withdraw20k.args = {
    amount: v('1210000'),
    pool: v('0'),
    poolRequiredLiquidity: v('0'),
    stake: v('0'),
    unstake: v('0'),
    withdraw: v('0'),
    stakingMature: v('1210000'),
    stakingMaturing: v('0'),
    stakingReleasing: v('0'),
    stakingReleased: v('0'),
};
