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
import { PoolActivity } from '../../components/stake/PoolActivity';

export default {
    title: 'Stake/PoolActivity',
    component: PoolActivity,
    argTypes: {},
} as Meta<typeof PoolActivity>;

type Story = StoryObj<typeof PoolActivity>;

const Template: Story = {
    render: (args) => <PoolActivity {...args} />,
};

export const Default: Story = {
    args: {
        poolAddress: '0xf8385b601582a9cf1ed603f2e8173a4cadfb0af4',
    },
    ...Template,
};
