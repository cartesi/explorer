// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { DateTime } from 'luxon';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import UsersChart from '../../components/stake/UsersChart';
import stakingPoolUserHistories from './stakingPoolUserHistories';

export default {
    title: 'Stake/UsersChart',
    component: UsersChart,
    argTypes: {},
} as ComponentMeta<typeof UsersChart>;

const Template: ComponentStory<typeof UsersChart> = (args) => (
    <UsersChart {...args} />
);

const defaultProps = {
    data: stakingPoolUserHistories,
    month: DateTime.fromJSDate(new Date()),
    totalUsers: 100,
    loading: false,
};

export const Default = Template.bind({});
Default.args = {
    ...defaultProps,
};

export const Loading = Template.bind({});
Loading.args = {
    ...defaultProps,
    loading: true,
};

export const NoItems = Template.bind({});
NoItems.args = {
    ...defaultProps,
    totalUsers: 0,
};
