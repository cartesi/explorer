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
import MarketInfoPanel from '../../components/home/MarketInfoPanel';

export default {
    title: 'Home/Market Info Panel',
    component: MarketInfoPanel,
    argTypes: {},
} as ComponentMeta<typeof MarketInfoPanel>;

const Template: ComponentStory<typeof MarketInfoPanel> = (args) => (
    <MarketInfoPanel {...args} />
);

const defaultProps = {
    label: 'Price',
    value: 123441206,
    unit: 'USD',
};

export const Default = Template.bind({});
Default.args = {
    ...defaultProps,
};

export const CTSI = Template.bind({});
CTSI.args = {
    ...defaultProps,
    value: 380469518,
    unit: 'CTSI',
};
