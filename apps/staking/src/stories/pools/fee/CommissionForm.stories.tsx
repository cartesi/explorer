// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CommissionForm from '../../../components/pools/fee/CommissionForm';

export default {
    title: 'Pools/Fee/CommissionForm',
    component: CommissionForm,
    argTypes: {},
} as ComponentMeta<typeof CommissionForm>;

const Template: ComponentStory<typeof CommissionForm> = (args) => (
    <CommissionForm {...args} />
);

const now = new Date();

export const FlatRate = Template.bind({});
FlatRate.args = {
    currentValue: 14.5,
    unit: '%',
    min: 0,
    max: 100,
    maxRaise: 5,
    maxDigits: 2,
    increaseWaitPeriod: 60 * 60 * 24 * 7, // 7 days
    nextIncrease: new Date(now.getTime() - 60 * 1000),
    helperText:
        'Commission is set as a fixed percentage of every block reward (CTSI)',
};

export const IncreaseLocked = Template.bind({});
IncreaseLocked.args = {
    currentValue: 14.5,
    unit: '%',
    min: 0,
    max: 100,
    maxRaise: 5,
    maxDigits: 2,
    increaseWaitPeriod: 60 * 60 * 24 * 7, // 7 days
    nextIncrease: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    helperText:
        'Commission is set as a fixed percentage of every block reward (CTSI)',
};

export const GasTax = Template.bind({});
GasTax.args = {
    currentValue: 210000,
    unit: 'gas',
    min: 0,
    maxRaise: 20000,
    maxDigits: 0,
    increaseWaitPeriod: 60 * 60 * 24 * 7, // 7 days
    nextIncrease: new Date(now.getTime() - 60 * 1000),
    helperText:
        'Commission is set as an amount of gas. This amount is converted to CTSI at the time of block production, by using a gas price from an oracle and a ETH/CTSI price from a price oracle.',
};
