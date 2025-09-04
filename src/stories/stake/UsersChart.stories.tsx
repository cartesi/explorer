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
import UsersChart from '../../components/stake/UsersChart';
import stakingPoolUserHistories from './stakingPoolUserHistories';
import { StakingPoolUserHistory } from '../../graphql/models';

export default {
    title: 'Stake/UsersChart',
    component: UsersChart,
    argTypes: {},
} as Meta<typeof UsersChart>;

type Story = StoryObj<typeof UsersChart>;

const Template: Story = {
    render: (args) => <UsersChart {...args} />,
};

const defaultProps = {
    data: stakingPoolUserHistories as unknown as StakingPoolUserHistory[],
    month: new Date(),
    totalUsers: 100,
    loading: false,
};

export const Default: Story = {
    args: {
        ...defaultProps,
    },
    ...Template,
};

export const Loading: Story = {
    args: {
        ...defaultProps,
        loading: true,
    },
    ...Template,
};

export const NoItems: Story = {
    args: {
        ...defaultProps,
        totalUsers: 0,
    },
    ...Template,
};
