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

import PoolTableExtended from './../../components/pools/PoolTableExtended';

export default {
    title: 'Pools/Table Extended',
    component: PoolTableExtended,
    argTypes: {},
} as ComponentMeta<typeof PoolTableExtended>;

const Template: ComponentStory<typeof PoolTableExtended> = (args) => (
    <PoolTableExtended {...args} />
);

export const Loading = Template.bind({});
Loading.args = {
    loading: true,
};

import data from './poolsExtended.json';

export const Default = Template.bind({});
Default.args = {
    loading: false,
    sort: 'balance',
    data: data.data.allStakingPools.nodes,
    account: '0x79bdc19c6f823f2911190b005f489ed00af6246d',
};

export const NoItems = Template.bind({});
NoItems.args = {
    loading: false,
    data: [],
};
