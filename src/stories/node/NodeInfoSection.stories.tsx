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

import { NodeInfoSection } from '../../components/node/NodeInfoSection';
import { ethers } from 'ethers';

export default {
    title: 'Node/NodeInfoSection',
    component: NodeInfoSection,
    argTypes: {},
} as Meta<typeof NodeInfoSection>;

type Story = StoryObj<typeof NodeInfoSection>;

const Template: Story = {
    render: (args) => <NodeInfoSection {...args} />,
};

const defaultProps = {
    address: '0xb00299b573a9deee20e6a242416188d1033e325f',
    userBalance: ethers.utils.parseEther('5.345'),
    nodeBalance: ethers.utils.parseEther('2.345'),
};

export const NodeHire: Story = {
    args: { ...defaultProps },
    ...Template,
};

export const NodeInfo: Story = {
    args: {
        ...defaultProps,
        ownerAccount: '0x2942aa4356783892c624125acfbbb80d29629a9d',
    },
    ...Template,
};

export const NodeAuthorize: Story = {
    args: {
        ...defaultProps,
        isAuthorized: false,
        onAuthorize: () =>
            alert('Wallet signature confirmation would open instead! =)'),
    },
    ...Template,
};

export const NodeAuthorizing: Story = {
    args: {
        ...defaultProps,
        isAuthorizing: true,
        isAuthorized: false,
        onAuthorize: () => null,
    },
    ...Template,
};
