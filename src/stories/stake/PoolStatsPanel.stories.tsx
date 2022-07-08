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
import PoolStatsPanel from '../../components/stake/PoolStatsPanel';
import { BigNumber } from 'ethers';

const defaultValue = '1000000000000000000000';

const defaultStakingPoolFee = {
    id: '1231',
    commission: 15,
    gas: 15,
    created: 1531082309810,
    lastUpdated: 1531082309810,
};

export default {
    title: 'Stake/PoolStatsPanel',
    component: PoolStatsPanel,
    argTypes: {},
} as ComponentMeta<typeof PoolStatsPanel>;

const Template: ComponentStory<typeof PoolStatsPanel> = (args) => (
    <PoolStatsPanel {...args} />
);

export const Default = Template.bind({});
Default.args = {
    address: 'General Gurko 75 str',
    stakedBalance: BigNumber.from(defaultValue),
    totalBlocks: 100,
    totalUsers: 50,
    productionInterval: 1000,
    totalReward: defaultValue,
    commissionPercentage: 15,
    fee: defaultStakingPoolFee,
    amount: BigNumber.from(defaultValue),
    pool: BigNumber.from(defaultValue),
    stake: BigNumber.from(defaultValue),
    withdraw: BigNumber.from(defaultValue),
    stakingMature: BigNumber.from(defaultValue),
    stakingMaturing: BigNumber.from(defaultValue),
    stakingReleasing: BigNumber.from(defaultValue),
    stakingReleased: BigNumber.from(defaultValue),
    stakingMaturingTimestamp: new Date(),
    stakingReleasingTimestamp: new Date(),
    hideZeros: false,
    onRebalance: () => {
        console.log('onRebalance::');
    },
};

// address: string;
// stakedBalance: BigNumber;
// totalBlocks: number;
// totalUsers: number;
// productionInterval: number; // average number of milliseconds between blocks considering the last 10 produced blocks
// totalReward: BigNumberish;
// commissionPercentage: number;
// fee: StakingPoolFee;
// amount: BigNumber;
// pool: BigNumber;
// stake: BigNumber;
// unstake: BigNumber;
// withdraw: BigNumber;
// stakingMature: BigNumber;
// stakingMaturing: BigNumber;
// stakingReleasing: BigNumber;
// stakingReleased: BigNumber;
// stakingMaturingTimestamp: Date;
// stakingReleasingTimestamp: Date;
// hideZeros: boolean;
// onRebalance?: () => void;
