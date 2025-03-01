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
import { AllowanceSection } from '../../../components/stake/components/AllowanceSection';
import { BigNumber } from 'ethers';

const defaultValue = BigNumber.from('10000000000000000000000000000');

export default {
    title: 'Stake/Components/AllowanceSection',
    component: AllowanceSection,
    argTypes: {},
} as Meta<typeof AllowanceSection>;

type Story = StoryObj<typeof AllowanceSection>;

const Template: Story = {
    render: (args) => <AllowanceSection {...args} />,
};

export const Default: Story = {
    args: {
        allowance: defaultValue,
        onAllowanceClick: () => undefined,
    },
    ...Template,
};

export const ZeroAllowance: Story = {
    args: {
        ...Default.args,
        allowance: BigNumber.from(0),
    },
    ...Template,
};
