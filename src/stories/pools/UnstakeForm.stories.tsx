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

import UnstakeForm from '../../components/pools/UnstakeForm';
import { BigNumber, ethers } from 'ethers';

export default {
    title: 'Pools/Unstake Form',
    component: UnstakeForm,
    argTypes: {},
} as ComponentMeta<typeof UnstakeForm>;

const Template: ComponentStory<typeof UnstakeForm> = (args) => (
    <UnstakeForm {...args} />
);

export const ZeroShares = Template.bind({});
ZeroShares.args = { shares: BigNumber.from(0), amount: BigNumber.from(0) };

export const Enabled = Template.bind({});
Enabled.args = {
    shares: ethers.utils.parseUnits('100000', 18),
    amount: ethers.utils.parseUnits('100000', 18),
};
