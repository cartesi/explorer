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
import { TbCoins, TbWallet } from 'react-icons/tb';

import CTSIText from '../components/CTSIText';
import { Text, Icon } from '@chakra-ui/react';
import { ethers } from 'ethers';

export default {
    title: 'CTSI Text',
    component: CTSIText,
    argTypes: {},
} as Meta<typeof CTSIText>;

type Story = StoryObj<typeof CTSIText>;

const Template: Story = {
    render: (args) => (
        <CTSIText value="5000100000000000000000000" {...args}>
            <Text>Wallet Balance</Text>
        </CTSIText>
    ),
};

export const Vertical: Story = { ...Template };

export const WithIcon: Story = {
    args: {
        icon: <Icon as={TbCoins} />,
    },
    ...Template,
};

export const Horizontal: Story = {
    args: {
        icon: <Icon as={TbWallet} />,
        direction: 'row',
    },
    ...Template,
};

export const FractionalAmount: Story = {
    args: {
        value: ethers.utils.parseUnits('0.0001', 18),
    },
    ...Template,
};

export const HugeAmount: Story = {
    args: {
        value: ethers.utils.parseUnits('345812800.12', 18),
        options: {
            notation: 'compact',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        },
    },
    ...Template,
};

export const Red: Story = {
    args: {
        icon: <Icon as={TbWallet} />,
        direction: 'row',
        color: 'red',
    },
    ...Template,
};
