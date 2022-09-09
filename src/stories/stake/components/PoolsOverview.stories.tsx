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
import PoolsOverview from '../../../components/stake/components/PoolsOverview';
import { BigNumber } from 'ethers';

export default {
    title: 'Stake/Components/PoolsOverview',
    component: PoolsOverview,
    argTypes: {},
} as ComponentMeta<typeof PoolsOverview>;

const Template: ComponentStory<typeof PoolsOverview> = (args) => (
    <PoolsOverview {...args} />
);

const defaultProps = {
    balance: BigNumber.from('10000000000000000000000'),
    poolBalancesCount: 10,
    summary: {
        id: '1',
        totalUsers: 2,
        totalPools: 3,
        totalStakers: 4,
        totalNodes: 5,
        totalStaked: 6,
        totalBlocks: 7,
        totalReward: 8,
        totalProtocols: 9,
        totalChains: 10,
    },
};

export const Default = Template.bind({});
Default.args = {
    ...defaultProps,
};
