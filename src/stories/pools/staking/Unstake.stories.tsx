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

import Unstake from '../../../components/pools/staking/Unstake';
import { ethers } from 'ethers';

export default {
    title: 'Pools/Staking/Unstake',
    component: Unstake,
    argTypes: {},
} as ComponentMeta<typeof Unstake>;

const Template: ComponentStory<typeof Unstake> = (args) => (
    <Unstake {...args} />
);

export const Zero = Template.bind({});
Zero.args = {
    balance: ethers.utils.parseUnits('0', 18),
    shares: ethers.utils.parseUnits('0', 27),
};

export const NonZero = Template.bind({});
NonZero.args = {
    balance: ethers.utils.parseUnits('20000', 18),
    shares: ethers.utils.parseUnits('20000', 27),
};
