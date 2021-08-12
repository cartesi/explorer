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

import Withdraw from '../../../components/pools/staking/Withdraw';
import { ethers } from 'ethers';

export default {
    title: 'Pools/Staking/Withdraw',
    component: Withdraw,
    argTypes: {},
} as ComponentMeta<typeof Withdraw>;

const Template: ComponentStory<typeof Withdraw> = (args) => (
    <Withdraw {...args} />
);

export const Zero = Template.bind({});
Zero.args = {
    balance: ethers.utils.parseUnits('0', 18),
};

export const NonZero = Template.bind({});
NonZero.args = {
    balance: ethers.utils.parseUnits('20000', 18),
};
