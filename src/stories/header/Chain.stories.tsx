// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Meta, StoryObj } from '@storybook/react';
import Chain from '../../components/header/Chain';

export default {
    title: 'Header/Chain',
    component: Chain,
    argTypes: {},
} as Meta<typeof Chain>;

type Story = StoryObj<typeof Chain>;

const Template: Story = {
    render: (args) => <Chain {...args} />,
};

export const Mainnet: Story = {
    args: { chainId: 1 },
    ...Template,
};

export const ExplicitMainnet: Story = {
    args: { chainId: 1, showMainnet: true },
    ...Template,
};

export const Sepolia: Story = {
    args: { chainId: 11155111 },
    ...Template,
};

export const Localhost: Story = {
    args: { chainId: 31337 },
    ...Template,
};

export const Disconnected: Story = {
    ...Template,
};
