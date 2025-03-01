// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import PoolPerformanceTable from '../../../components/stake/tables/PoolPerformanceTable';
import stakingPoolsData from './stakingPoolsData';
import { StakingPool, StakingPoolSort } from '../../../graphql/models';

export default {
    title: 'Stake/PoolPerformanceTable',
    component: PoolPerformanceTable,
    argTypes: {},
} as Meta<typeof PoolPerformanceTable>;

type Story = StoryObj<typeof PoolPerformanceTable>;

const Template: Story = {
    render: (args) => <PoolPerformanceTable {...args} />,
};

const defaultProps = {
    account: '0x17b41c2b437e69dd1523bf1cff5de63ad9bb3dc6',
    chainId: 5,
    loading: false,
    sort: 'commissionPercentage' as StakingPoolSort,
    data: stakingPoolsData as unknown as StakingPool[],
};

export const Default: Story = {
    args: {
        ...defaultProps,
    },
    ...Template,
};
