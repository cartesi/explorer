// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Table, Tbody } from '@chakra-ui/react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import UserRow from '../../components/users/UserRow';

export default {
    title: 'Users/Item',
    component: UserRow,
    argTypes: {},
} as ComponentMeta<typeof UserRow>;

const Template: ComponentStory<typeof UserRow> = (args) => (
    <Table>
        <Tbody>
            <UserRow {...args} />
        </Tbody>
    </Table>
);

const user = {
    id: '0xe6eb0a6687a658c3af15a26879ce2c9f1385dcf6',
    stakedBalance: '100000000000000000000000',
    balance: '110000000000000000000000',
    totalBlocks: 234,
    totalReward: '29000000000000000000000',
    pool: undefined,
};

export const User = Template.bind({});
User.args = {
    user,
};

export const Pool = Template.bind({});
Pool.args = {
    user: { ...user, pool: { manager: user.id } },
};

export const PoolOwner = Template.bind({});
PoolOwner.args = {
    account: user.id,
    user: { ...user, pool: { manager: user.id } },
};
