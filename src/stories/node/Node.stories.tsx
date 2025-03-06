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
import { constants, ethers } from 'ethers';

import Node from '../../components/node/Node';

export default {
    title: 'Node/Node',
    component: Node,
    argTypes: {},
} as Meta<typeof Node>;

type Story = StoryObj<typeof Node>;

const Template: Story = {
    render: (args) => <Node {...args} />,
};

export const Blank: Story = {
    args: {
        chainId: 1,
        user: '',
        userBalance: constants.Zero,
        balance: constants.Zero,
        address: '',
        available: false,
        pending: false,
        owned: false,
        retired: false,
        authorized: false,
    },
    ...Template,
};

export const Available: Story = {
    args: {
        chainId: 1,
        account: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        user: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        userBalance: ethers.utils.parseEther('2.345'),
        balance: constants.Zero,
        address: '0x938438004d764b81a6d5322828d36db856cef2ef',
        available: true,
        pending: false,
        owned: false,
        retired: false,
        authorized: false,
    },
    ...Template,
};

export const Pending: Story = {
    args: {
        chainId: 1,
        account: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        user: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        userBalance: ethers.utils.parseEther('2.345'),
        balance: ethers.utils.parseEther('0.001'),
        address: '0x938438004d764b81a6d5322828d36db856cef2ef',
        available: false,
        pending: true,
        owned: false,
        retired: false,
        authorized: false,
    },
    ...Template,
};

export const PendingFromAnother: Story = {
    args: {
        chainId: 1,
        account: '0x2218B3b41581E3B3fea3d1CB5e37d9C66fa5d3A0',
        user: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        userBalance: ethers.utils.parseEther('2.345'),
        balance: ethers.utils.parseEther('0.001'),
        address: '0x938438004d764b81a6d5322828d36db856cef2ef',
        available: false,
        pending: true,
        owned: false,
        retired: false,
        authorized: false,
    },
    ...Template,
};

export const Owned: Story = {
    args: {
        chainId: 1,
        account: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        user: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        userBalance: ethers.utils.parseEther('2.345'),
        balance: ethers.utils.parseEther('0.001'),
        address: '0x938438004d764b81a6d5322828d36db856cef2ef',
        available: false,
        pending: false,
        owned: true,
        retired: false,
        authorized: true,
    },
    ...Template,
};

export const OwnedUnauthorized: Story = {
    args: {
        chainId: 1,
        account: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        user: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        userBalance: ethers.utils.parseEther('2.345'),
        balance: ethers.utils.parseEther('0.001'),
        address: '0x938438004d764b81a6d5322828d36db856cef2ef',
        available: false,
        pending: false,
        owned: true,
        retired: false,
        authorized: false,
    },
    ...Template,
};

export const OwnedFromAnother: Story = {
    args: {
        chainId: 1,
        account: '0x2218B3b41581E3B3fea3d1CB5e37d9C66fa5d3A0',
        user: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        userBalance: ethers.utils.parseEther('2.345'),
        balance: ethers.utils.parseEther('0.001'),
        address: '0x938438004d764b81a6d5322828d36db856cef2ef',
        available: false,
        pending: false,
        owned: true,
        retired: false,
        authorized: true,
    },
    ...Template,
};

export const Retired: Story = {
    args: {
        chainId: 1,
        account: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        user: '0x18930e8a66a1DbE21D00581216789AAB7460Afd0',
        userBalance: ethers.utils.parseEther('2.345'),
        balance: ethers.utils.parseEther('0.001'),
        address: '0x938438004d764b81a6d5322828d36db856cef2ef',
        available: false,
        pending: false,
        owned: false,
        retired: true,
        authorized: true,
    },
    ...Template,
};
