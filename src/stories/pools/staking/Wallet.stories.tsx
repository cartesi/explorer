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

import Wallet from '../../../components/pools/staking/Wallet';
import { ethers } from 'ethers';

export default {
    title: 'Pools/Staking/Wallet',
    component: Wallet,
    argTypes: {},
} as ComponentMeta<typeof Wallet>;

const Template: ComponentStory<typeof Wallet> = (args) => <Wallet {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    balance: ethers.utils.parseUnits('92400', 18),
};

export const Modified = Template.bind({});
Modified.args = {
    balance: ethers.utils.parseUnits('92400', 18),
    futureBalance: ethers.utils.parseUnits('12400', 18),
};

export const NotModified = Template.bind({});
NotModified.args = {
    balance: ethers.utils.parseUnits('92400', 18),
    futureBalance: ethers.utils.parseUnits('92400', 18),
};
