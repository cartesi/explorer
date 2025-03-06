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

import RetiredNode from '../../components/node/RetiredNode';
import { ethers } from 'ethers';

export default {
    title: 'Node/Retired Node',
    component: RetiredNode,
    argTypes: {},
} as Meta<typeof RetiredNode>;

type Story = StoryObj<typeof RetiredNode>;

const Template: Story = {
    render: (args) => <RetiredNode {...args} />,
};

export const Basic: Story = {
    args: {
        chainId: 5,
        user: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        balance: ethers.utils.parseEther('0.1'),
    },
    ...Template,
};

export const SomeoneElse: Story = {
    args: {
        chainId: 5,
        user: '0x2218B3b41581E3B3fea3d1CB5e37d9C66fa5d3A0',
        balance: ethers.utils.parseEther('0.1'),
    },
    ...Template,
};
