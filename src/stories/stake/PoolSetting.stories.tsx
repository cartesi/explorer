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
import { PoolSetting } from '../../components/stake/PoolSetting';

export default {
    title: 'Stake/PoolSetting',
    component: PoolSetting,
    argTypes: {},
} as Meta<typeof PoolSetting>;

type Story = StoryObj<typeof PoolSetting>;

const Template: Story = {
    render: (args) => <PoolSetting {...args} />,
};

export const Default: Story = {
    ...Template,
};
