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

import ActionsTab from '../../components/pools/ActionsTab';
import { BigNumber, ethers } from 'ethers';

export default {
    title: 'Pools/Actions Tab',
    component: ActionsTab,
    argTypes: {},
} as ComponentMeta<typeof ActionsTab>;

const Template: ComponentStory<typeof ActionsTab> = (args) => (
    <ActionsTab {...args} />
);

export const Default = Template.bind({});
Default.args = {
    allowance: BigNumber.from(0),
    paused: false,
    stakedAmount: ethers.utils.parseUnits('100000', 18),
    stakedShares: ethers.utils.parseUnits('100000', 18),
    releasedBalance: BigNumber.from(0),
    withdrawBalance: BigNumber.from(0),
};

export const Paused = Template.bind({});
Paused.args = {
    allowance: BigNumber.from(0),
    paused: true,
    stakedAmount: ethers.utils.parseUnits('100000', 18),
    stakedShares: ethers.utils.parseUnits('100000', 18),
    releasedBalance: BigNumber.from(0),
    withdrawBalance: BigNumber.from(0),
};
