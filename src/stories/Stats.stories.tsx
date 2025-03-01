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

import Stats from '../components/Stats';

export default {
    title: 'Stats',
    component: Stats,
    argTypes: {},
} as Meta<typeof Stats>;

type Story = StoryObj<typeof Stats>;

const Template: Story = {
    render: (args) => <Stats {...args} />,
};

export const Nodes: Story = {
    args: {
        label: '# Active Nodes',
        value: 274,
    },
    ...Template,
};

export const TotalStaked: Story = {
    args: {
        label: 'TotalStaked',
        value: 86283342,
        fractionDigits: 2,
        help: 'Total amount of CTSI locked in the staking contract, currently  in the status "staked"',
    },
    ...Template,
};

export const APR: Story = {
    args: {
        label: 'Projected Annual Earnings',
        value: 0.616329,
        unit: 'percent',
        fractionDigits: 1,
    },
    ...Template,
};

export const ParticipationRate: Story = {
    args: {
        label: 'Participation Rate',
        value: 0.2277428,
        unit: 'percent',
        fractionDigits: 1,
    },
    ...Template,
};

export const NoValue: Story = {
    args: {
        label: 'Participation Rate',
        value: undefined,
    },
    ...Template,
};
