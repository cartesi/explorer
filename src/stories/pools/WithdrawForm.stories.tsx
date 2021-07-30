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

import WithdrawForm from '../../components/pools/WithdrawForm';
import { BigNumber, ethers } from 'ethers';

export default {
    title: 'Pools/Withdraw Form',
    component: WithdrawForm,
    argTypes: {},
} as ComponentMeta<typeof WithdrawForm>;

const Template: ComponentStory<typeof WithdrawForm> = (args) => (
    <WithdrawForm {...args} />
);

export const ZeroReleased = Template.bind({});
ZeroReleased.args = {
    releasedBalance: BigNumber.from(0),
    withdrawBalance: BigNumber.from(0),
};

export const ZeroWithdraw = Template.bind({});
ZeroWithdraw.args = {
    releasedBalance: ethers.utils.parseUnits('100000', 18),
    withdrawBalance: BigNumber.from(0),
};

export const Enabled = Template.bind({});
Enabled.args = {
    releasedBalance: ethers.utils.parseUnits('100000', 18),
    withdrawBalance: ethers.utils.parseUnits('100000', 18),
};
