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
import { StakingTabNavigation } from '../../components/stake/StakingTabNavigation';

export default {
    title: 'Stake/StakingTabNavigation',
    component: StakingTabNavigation,
    argTypes: {},
} as Meta<typeof StakingTabNavigation>;

type Story = StoryObj<typeof StakingTabNavigation>;

const Template: Story = {
    render: (args) => <StakingTabNavigation {...args} />,
};

export const Default: Story = {
    ...Template,
};
