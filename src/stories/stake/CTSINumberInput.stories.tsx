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
import { CTSINumberInput } from '../../components/stake/CTSINumberInput';

export default {
    title: 'Stake/CTSINumberInput',
    component: CTSINumberInput,
    argTypes: {},
} as Meta<typeof CTSINumberInput>;

type Story = StoryObj<typeof CTSINumberInput>;

const Template: Story = {
    render: (args) => <CTSINumberInput {...args} />,
};

export const Default: Story = {
    ...Template,
};

export const WithValue: Story = {
    args: {
        ...Default.args,
        value: 1000,
    },
    ...Template,
};

export const WithMinValue: Story = {
    args: {
        ...Default.args,
        value: 1000,
        min: 1000,
    },
    ...Template,
};

export const WithMaxValue: Story = {
    args: {
        ...Default.args,
        value: 1000,
        max: 1000,
    },
    ...Template,
};

export const WithMaxPrecision: Story = {
    args: {
        ...Default.args,
        value: 1000.55,
        maxPrecision: 2,
    },
    ...Template,
};
