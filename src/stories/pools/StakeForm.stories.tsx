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

import StakeForm from '../../components/pools/StakeForm';
import { BigNumber, ethers } from 'ethers';

export default {
    title: 'Pools/Stake Form',
    component: StakeForm,
    argTypes: {},
} as ComponentMeta<typeof StakeForm>;

const Template: ComponentStory<typeof StakeForm> = (args) => (
    <StakeForm {...args} />
);

export const ZeroAllowance = Template.bind({});
ZeroAllowance.args = { allowance: BigNumber.from(0), paused: false };

export const WithAllowance = Template.bind({});
WithAllowance.args = {
    allowance: ethers.utils.parseUnits('1000', 18),
    paused: false,
};

export const Paused = Template.bind({});
Paused.args = {
    allowance: ethers.utils.parseUnits('1000', 18),
    paused: true,
};
