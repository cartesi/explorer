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
import { PoolBalanceSection } from '../../../components/stake/components/PoolBalanceSection';
import { BigNumber } from 'ethers';

const defaultValue = '10000000000000000000000000000';

export default {
    title: 'Stake/Components/PoolBalanceSection',
    component: PoolBalanceSection,
    argTypes: {},
} as ComponentMeta<typeof PoolBalanceSection>;

const Template: ComponentStory<typeof PoolBalanceSection> = (args) => (
    <PoolBalanceSection {...args} />
);

export const Default = Template.bind({});
Default.args = {
    userPoolBalance: BigNumber.from(defaultValue),
    isPoolBalanceLocked: false,
    onStakeClick: () => undefined,
    onWithdrawClick: () => undefined,
};

export const PoolBalanceLocked = Template.bind({});
PoolBalanceLocked.args = {
    ...Default.args,
    isPoolBalanceLocked: true,
};

export const ZeroUserPoolBalance = Template.bind({});
ZeroUserPoolBalance.args = {
    ...Default.args,
    userPoolBalance: BigNumber.from(0),
};
