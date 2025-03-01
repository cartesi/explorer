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

import MarketInfo from '../components/MarketInfo';

export default {
    title: 'Market Info',
    component: MarketInfo,
    argTypes: {},
} as Meta<typeof MarketInfo>;

type Story = StoryObj<typeof MarketInfo>;

const Template: Story = {
    render: (args) => <MarketInfo {...args} />,
};

export const Price: Story = {
    args: {
        label: 'CTSI Price',
        value: 0.7653621818,
        unit: 'USD',
    },
    ...Template,
};

export const MarketCap: Story = {
    args: {
        label: 'CTSI Market Cap',
        value: 123441206,
        unit: 'USD',
    },
    ...Template,
};

export const CircSupply: Story = {
    args: {
        label: 'Circ. Supply',
        value: 380469518,
        unit: 'CTSI',
    },
    ...Template,
};

export const NoValue: Story = {
    args: {
        label: 'CTSI Price',
        value: undefined,
    },
    ...Template,
};
