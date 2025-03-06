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
import PoolBalanceStat from '../../../components/stake/stats/PoolBalanceStat';
import { BigNumber } from 'ethers';

const defaultBigNumberValue = BigNumber.from('10000000000000000000000000000');

export default {
    title: 'Stake/Stats/PoolBalanceStat',
    component: PoolBalanceStat,
    argTypes: {},
} as Meta<typeof PoolBalanceStat>;

type Story = StoryObj<typeof PoolBalanceStat>;

const Template: Story = {
    render: (args) => <PoolBalanceStat {...args} />,
};

export const Default: Story = {
    args: {
        pool: defaultBigNumberValue,
    },
    ...Template,
};
