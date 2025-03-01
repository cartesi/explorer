// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ComponentMeta, ComponentStory } from '@storybook/react';

import UserTable from '../../components/users/UserTable';

export default {
    title: 'Users/Table',
    component: UserTable,
    argTypes: {},
} as ComponentMeta<typeof UserTable>;

const Template: ComponentStory<typeof UserTable> = (args) => (
    <UserTable {...args} />
);

export const Loading = Template.bind({});
Loading.args = {
    loading: true,
};

const data = [
    {
        id: '0xe6eb0a6687a658c3af15a26879ce2c9f1385dcf6',
        stakedBalance: '18191058000000000000000000',
        balance: '18191058000000000000000000',
        totalBlocks: 1487,
        totalReward: '4312300000000000000000000',
        pool: undefined,
    },
    {
        id: '0x9cc1ae3a31224920a47d4d859cdee7149da53e49',
        stakedBalance: '10028372000000000000000000',
        balance: '10028372000000000000000000',
        totalBlocks: 1231,
        totalReward: '3569900000000000000000000',
        pool: undefined,
    },
    {
        id: '0x4b0b3c9506d5008fccfb458361e06d28d4d3bcad',
        stakedBalance: '9800001000000000000000000',
        balance: '9800001000000000000000000',
        totalBlocks: 367,
        totalReward: '1064300000000000000000000',
        pool: undefined,
    },
    {
        id: '0xc13fccab9b45a635eadde7214c2a008d979821ae',
        stakedBalance: '9060421000000000000000000',
        balance: '1060421000000000000000000',
        totalBlocks: 861,
        totalReward: '2496900000000000000000000',
        pool: undefined,
    },
];

export const Default = Template.bind({});
Default.args = {
    loading: false,
    sort: 'balance',
    data,
};

export const NoItens = Template.bind({});
NoItens.args = {
    loading: false,
    data: [],
};
