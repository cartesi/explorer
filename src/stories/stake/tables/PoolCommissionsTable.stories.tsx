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
import PoolCommissionsTable from '../../../components/stake/tables/PoolCommissionsTable';
import commissionsData from './commissionsData';
import { StakingPoolFeeHistory } from '../../../graphql/models';

export default {
    title: 'Stake/PoolCommissionsTable',
    component: PoolCommissionsTable,
    argTypes: {},
} as Meta<typeof PoolCommissionsTable>;

type Story = StoryObj<typeof PoolCommissionsTable>;

const Template: Story = {
    render: (args) => <PoolCommissionsTable {...args} />,
};

const defaultProps = {
    loading: false,
    data: commissionsData as unknown as StakingPoolFeeHistory[],
};

export const Default: Story = {
    args: {
        ...defaultProps,
    },
    ...Template,
};
