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

import Staked from '../../../components/pools/staking/Staked';
import { ethers } from 'ethers';

export default {
    title: 'Pools/Staking/Staked',
    component: Staked,
    argTypes: {},
} as ComponentMeta<typeof Staked>;

const Template: ComponentStory<typeof Staked> = (args) => <Staked {...args} />;

const lockTime = 120;
const now = new Date();
const past = new Date(now.getTime() - lockTime * 2000);

export const Basic = Template.bind({});
Basic.args = {
    balance: ethers.utils.parseUnits('2000', 18),
    depositTimestamp: past,
    lockTime,
};

export const Zero = Template.bind({});
Zero.args = {
    balance: ethers.utils.parseUnits('0', 18),
    depositTimestamp: past,
    lockTime,
};

export const NoBalance = Template.bind({});
NoBalance.args = {
    balance: ethers.utils.parseUnits('0', 18),
    depositTimestamp: past,
    lockTime,
};

export const Locked = Template.bind({});
Locked.args = {
    balance: ethers.utils.parseUnits('0', 18),
    depositTimestamp: now,
    lockTime,
};

export const LongLock = Template.bind({});
LongLock.args = {
    balance: ethers.utils.parseUnits('0', 18),
    depositTimestamp: now,
    lockTime: 21600, // 6 hours
};
