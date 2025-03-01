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
import { StakedBalanceSection } from '../../../components/stake/components/StakedBalanceSection';
import { BigNumber } from 'ethers';

const defaultValue = '10000000000000000000000000000';

export default {
    title: 'Stake/Components/StakedBalanceSection',
    component: StakedBalanceSection,
    argTypes: {},
} as Meta<typeof StakedBalanceSection>;

type Story = StoryObj<typeof StakedBalanceSection>;

const Template: Story = {
    render: (args) => <StakedBalanceSection {...args} />,
};

export const Default: Story = {
    args: {
        stakedBalance: BigNumber.from(defaultValue),
        onUnstakeClick: () => undefined,
    },
    ...Template,
};

export const ZeroStakedBalance: Story = {
    args: {
        ...Default.args,
        stakedBalance: BigNumber.from(0),
    },
    ...Template,
};
