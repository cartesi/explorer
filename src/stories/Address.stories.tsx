// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Meta, StoryObj } from '@storybook/react';
import Address from '../components/Address';
import { StakePlusIcon } from '../components/Icons';
import { FC } from 'react';
import { IconProps } from '@chakra-ui/react';

export default {
    title: 'Address',
    component: Address,
    argTypes: {},
} as Meta<typeof Address>;

type Story = StoryObj<typeof Address>;

const Template: Story = {
    render: (args) => (
        <Address
            {...args}
            address="0x491604c0FDF08347Dd1fa4Ee062a822A5DD06B5D"
        />
    ),
};

export const Basic: Story = {
    ...Template,
};

export const Truncated: Story = {
    args: {
        truncated: true,
    },
    ...Template,
};

export const HiddenActions: Story = {
    args: { hideActions: true },
    ...Template,
};

export const Responsive: Story = {
    args: { responsive: true },
    ...Template,
};

export const TokenLink: Story = {
    args: { type: 'token' },
    ...Template,
};

export const Sepolia: Story = {
    args: { chainId: 11155111 },
    ...Template,
};

export const WithName: Story = {
    args: { name: 'Pool Factory' },
    ...Template,
};

export const WithCustomFallbackAvatar: Story = {
    args: {
        shouldDisplayFallbackAvatar: true,
        fallbackAvatar: StakePlusIcon as FC<IconProps>,
    },
    ...Template,
};
