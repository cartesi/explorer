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

import PoolStatsPanel from '../../components/pools/PoolStatsPanel';
import { constants, ethers } from 'ethers';

export default {
    title: 'Pools/Pool Stats Panel',
    component: PoolStatsPanel,
    argTypes: {},
} as ComponentMeta<typeof PoolStatsPanel>;

const Template: ComponentStory<typeof PoolStatsPanel> = (args) => (
    <PoolStatsPanel {...args} />
);

const v = (n: string) => ethers.utils.parseUnits(n, 18);

export const Default = Template.bind({});
Default.args = {
    stakedBalance: v('1456000'),
    totalBlocks: 18,
    totalUsers: 3,
    productionInterval: 1000 * 60 * 60 * 5.4,
    totalReward: v((18 * 2900).toString()),
    totalCommission: v((18 * 2900 * 0.125).toString()),
};

export const NoBlocks = Template.bind({});
NoBlocks.args = {
    stakedBalance: v('1456000'),
    totalBlocks: 0,
    totalUsers: 3,
    productionInterval: 0,
    totalReward: constants.Zero,
    totalCommission: constants.Zero,
};

export const NoStake = Template.bind({});
NoStake.args = {
    stakedBalance: constants.Zero,
    totalBlocks: 0,
    totalUsers: 0,
    productionInterval: 0,
    totalReward: constants.Zero,
    totalCommission: constants.Zero,
};
