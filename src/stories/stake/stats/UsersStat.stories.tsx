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
import UsersStat from '../../../components/stake/stats/UsersStat';

export default {
    title: 'Stake/Stats/UsersStat',
    component: UsersStat,
    argTypes: {},
} as Meta<typeof UsersStat>;

type Story = StoryObj<typeof UsersStat>;

const Template: Story = {
    render: (args) => <UsersStat {...args} />,
};

export const Default: Story = {
    args: {
        totalUsers: 100,
        location: 'General Gurko Str. 75',
    },
    ...Template,
};

export const WithoutLocation: Story = {
    args: {
        ...Default.args,
        location: undefined,
    },
    ...Template,
};
