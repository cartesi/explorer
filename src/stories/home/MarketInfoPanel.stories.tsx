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
import { MarketInformation } from '../../services/market';

export default {
    title: 'Home/Market Info Panel',
    component: MarketInfoPanel,
    argTypes: {},
} as ComponentMeta<typeof MarketInfoPanel>;

const Template: ComponentStory<typeof MarketInfoPanel> = (args) => (
    <MarketInfoPanel {...args} />
);

const market: MarketInformation = {
    price: 0.7653621818,
    circulatingSupply: 380469518,
    marketCap: 123441206,
};

export const Basic = Template.bind({});
Basic.args = {
    market,
};

export const NoInfo = Template.bind({});
NoInfo.args = {
    market: undefined,
};
