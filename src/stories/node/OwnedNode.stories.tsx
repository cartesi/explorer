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

import OwnedNode from '../../components/node/OwnedNode';
import { ethers } from 'ethers';

export default {
    title: 'Node/Owned Node',
    component: OwnedNode,
    argTypes: {},
} as Meta<typeof OwnedNode>;

type Story = StoryObj<typeof OwnedNode>;

const Template: Story = {
    render: (args) => <OwnedNode {...args} />,
};

export const Basic: Story = {
    args: {
        account: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        authorized: true,
        chainId: 5,
        user: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        nodeBalance: ethers.utils.parseEther('0.1'),
        userBalance: ethers.utils.parseEther('2.345'),
    },
    ...Template,
};

export const SomeoneElse: Story = {
    args: {
        account: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        authorized: true,
        chainId: 5,
        user: '0x2218B3b41581E3B3fea3d1CB5e37d9C66fa5d3A0',
        nodeBalance: ethers.utils.parseEther('0.1'),
        userBalance: ethers.utils.parseEther('2.345'),
    },
    ...Template,
};

export const Unauthorized: Story = {
    args: {
        account: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        authorized: false,
        chainId: 5,
        user: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        nodeBalance: ethers.utils.parseEther('0.1'),
        userBalance: ethers.utils.parseEther('2.345'),
    },
    ...Template,
};
