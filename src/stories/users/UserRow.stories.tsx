// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Table } from '@chakra-ui/react';
import { Meta, StoryObj } from '@storybook/react';

import UserRow, { UserRowProps } from '../../components/users/UserRow';
import { StakingPool } from '../../graphql/models';

export default {
    title: 'Users/Item',
    component: UserRow,
    argTypes: {},
} as Meta<typeof UserRow>;

type Story = StoryObj<typeof UserRow>;

const Template: Story = {
    render: (args) => (
        <Table.Root>
            <Table.Body>
                <UserRow {...args} />
            </Table.Body>
        </Table.Root>
    ),
};

const user = {
    id: '0xe6eb0a6687a658c3af15a26879ce2c9f1385dcf6',
    stakedBalance: '100000000000000000000000',
    balance: '110000000000000000000000',
    totalBlocks: 234,
    totalReward: '29000000000000000000000',
    pool: undefined,
} as UserRowProps['user'];

export const User: Story = {
    args: {
        user,
    },
    ...Template,
};

export const Pool: Story = {
    args: {
        user: { ...user, pool: { manager: user.id } as StakingPool },
    },
    ...Template,
};
