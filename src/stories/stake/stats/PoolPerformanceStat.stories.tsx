// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Meta, StoryObj } from '@storybook/react';
import PoolPerformanceStat from '../../../components/stake/stats/PoolPerformanceStat';

const defaultAddress = '0x2942aa4356783892c624125acfbbb80d29629a9d';

export default {
    title: 'Stake/Stats/PoolPerformanceStat',
    component: PoolPerformanceStat,
    argTypes: {},
} as Meta<typeof PoolPerformanceStat>;

type Story = StoryObj<typeof PoolPerformanceStat>;

const Template: Story = {
    render: (args) => <PoolPerformanceStat {...args} />,
};

export const Default: Story = {
    args: {
        address: defaultAddress,
        location: 'Sofia, Bulgaria',
    },
    ...Template,
};

export const WithoutLocation: Story = {
    args: {
        address: defaultAddress,
    },
    ...Template,
};
