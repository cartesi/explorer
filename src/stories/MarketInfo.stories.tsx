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

import MarketInfo from '../components/MarketInfo';

export default {
    title: 'Market Info',
    component: MarketInfo,
    argTypes: {},
} as ComponentMeta<typeof MarketInfo>;

const Template: ComponentStory<typeof MarketInfo> = (args) => (
    <MarketInfo {...args} />
);

export const Price = Template.bind({});
Price.args = {
    label: 'CTSI Price',
    value: 0.7653621818,
    unit: 'USD',
};

export const MarketCap = Template.bind({});
MarketCap.args = {
    label: 'CTSI Market Cap',
    value: 123441206,
    unit: 'USD',
};

export const CircSuply = Template.bind({});
CircSuply.args = {
    label: 'Circ. Supply',
    value: 380469518,
    unit: 'CTSI',
};

export const NoValue = Template.bind({});
NoValue.args = {
    label: 'CTSI Price',
    value: undefined,
};
