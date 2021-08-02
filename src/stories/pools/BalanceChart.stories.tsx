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

import BalanceChart from '../../components/pools/BalanceChart';
import { ethers } from 'ethers';

export default {
    title: 'Pools/Balance Chart',
    component: BalanceChart,
    argTypes: {},
} as ComponentMeta<typeof BalanceChart>;

const Template: ComponentStory<typeof BalanceChart> = (args) => (
    <BalanceChart {...args} />
);

const v = (n: string) => ethers.utils.parseUnits(n, 18);

export const Balanced = Template.bind({});
Balanced.args = {
    amount: v('1200000'),
    poolBalance: v('0'),
    poolRequiredLiquidity: v('0'),
    stakingMatureBalance: v('1200000'),
    stakingMaturingBalance: v('0'),
    stakingReleasing: v('0'),
    stakingReleased: v('0'),
};

export const Stake30k = Template.bind({});
Stake30k.args = {
    amount: v('1230000'),
    poolBalance: v('30000'),
    poolRequiredLiquidity: v('0'),
    stakingMatureBalance: v('1200000'),
    stakingMaturingBalance: v('0'),
    stakingReleasing: v('0'),
    stakingReleased: v('0'),
};

export const Stake30kMaturing = Template.bind({});
Stake30kMaturing.args = {
    amount: v('1230000'),
    poolBalance: v('0'),
    poolRequiredLiquidity: v('0'),
    stakingMatureBalance: v('1200000'),
    stakingMaturingBalance: v('30000'),
    stakingReleasing: v('0'),
    stakingReleased: v('0'),
};

export const Stake30kMature = Template.bind({});
Stake30kMature.args = {
    amount: v('1230000'),
    poolBalance: v('0'),
    poolRequiredLiquidity: v('0'),
    stakingMatureBalance: v('1230000'),
    stakingMaturingBalance: v('0'),
    stakingReleasing: v('0'),
    stakingReleased: v('0'),
};

export const Unstake20k = Template.bind({});
Unstake20k.args = {
    amount: v('1210000'),
    poolBalance: v('0'),
    poolRequiredLiquidity: v('20000'),
    stakingMatureBalance: v('1230000'),
    stakingMaturingBalance: v('0'),
    stakingReleasing: v('0'),
    stakingReleased: v('0'),
};

export const Unstake20kMaturing = Template.bind({});
Unstake20kMaturing.args = {
    amount: v('1210000'),
    poolBalance: v('0'),
    poolRequiredLiquidity: v('20000'),
    stakingMatureBalance: v('1210000'),
    stakingMaturingBalance: v('0'),
    stakingReleasing: v('20000'),
    stakingReleased: v('0'),
};

export const Unstake20kReleased = Template.bind({});
Unstake20kReleased.args = {
    amount: v('1210000'),
    poolBalance: v('0'),
    poolRequiredLiquidity: v('20000'),
    stakingMatureBalance: v('1210000'),
    stakingMaturingBalance: v('0'),
    stakingReleasing: v('0'),
    stakingReleased: v('20000'),
};

export const Unstake20kWithdraw = Template.bind({});
Unstake20kWithdraw.args = {
    amount: v('1210000'),
    poolBalance: v('20000'),
    poolRequiredLiquidity: v('20000'),
    stakingMatureBalance: v('1210000'),
    stakingMaturingBalance: v('0'),
    stakingReleasing: v('0'),
    stakingReleased: v('0'),
};

export const Withdraw20k = Template.bind({});
Withdraw20k.args = {
    amount: v('1210000'),
    poolBalance: v('0'),
    poolRequiredLiquidity: v('0'),
    stakingMatureBalance: v('1210000'),
    stakingMaturingBalance: v('0'),
    stakingReleasing: v('0'),
    stakingReleased: v('0'),
};
