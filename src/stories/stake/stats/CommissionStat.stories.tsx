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
import CommissionStat from '../../../components/stake/stats/CommissionStat';

const defaultCommissionPercentage = 50;
const defaultFee = {
    id: '1',
    commission: 25,
    gas: 20,
    created: 1657193076608,
    lastUpdated: 1657193076608,
};
const defaultLocation = '/';

export default {
    title: 'Stake/Stats/CommissionStat',
    component: CommissionStat,
    argTypes: {},
} as Meta<typeof CommissionStat>;

type Story = StoryObj<typeof CommissionStat>;

const Template: Story = {
    render: (args) => <CommissionStat {...args} />,
};

export const Default: Story = {
    args: {
        commissionPercentage: defaultCommissionPercentage,
        fee: defaultFee,
        location: defaultLocation,
    },
    ...Template,
};

export const ZeroCommissionPercentage: Story = {
    args: {
        ...Default.args,
        commissionPercentage: 0,
    },
    ...Template,
};
