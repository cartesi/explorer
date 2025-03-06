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

import AvailableNode from '../../components/node/AvailableNode';
import { ethers } from 'ethers';

export default {
    title: 'Node/Available Node',
    component: AvailableNode,
    argTypes: {},
} as Meta<typeof AvailableNode>;

type Story = StoryObj<typeof AvailableNode>;

const Template: Story = {
    render: (args) => <AvailableNode {...args} />,
};

export const Basic: Story = {
    args: { balance: ethers.utils.parseEther('2.345') },
    ...Template,
};

export const ZeroBalance: Story = {
    args: { balance: ethers.utils.parseEther('0') },
    ...Template,
};
