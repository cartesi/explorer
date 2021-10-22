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

import PoolTable from './../../components/pools/PoolTable';

export default {
    title: 'Pools/Table',
    component: PoolTable,
    argTypes: {},
} as ComponentMeta<typeof PoolTable>;

const Template: ComponentStory<typeof PoolTable> = (args) => (
    <PoolTable {...args} />
);

export const Loading = Template.bind({});
Loading.args = {
    loading: true,
};

import data from './pools.json';

export const Default = Template.bind({});
Default.args = {
    loading: false,
    sort: 'balance',
    data: data.data.stakingPools,
    account: '0x79bdc19c6f823f2911190b005f489ed00af6246d',
};

export const NoItens = Template.bind({});
NoItens.args = {
    loading: false,
    data: [],
};
