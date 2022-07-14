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
import { DepositSection } from '../../../components/stake/components/DepositSection';
import { BigNumber } from 'ethers';

const defaultValue = '10000000000000000000000000000';

export default {
    title: 'Stake/Components/DepositSection',
    component: DepositSection,
    argTypes: {},
} as ComponentMeta<typeof DepositSection>;

const Template: ComponentStory<typeof DepositSection> = (args) => (
    <DepositSection {...args} />
);

export const Default = Template.bind({});
Default.args = {
    userWalletBalance: BigNumber.from(defaultValue),
    userETHBalance: BigNumber.from(defaultValue),
    onDepositClick: () => undefined,
};

export const ZeroUserWalletBalance = Template.bind({});
ZeroUserWalletBalance.args = {
    ...Default.args,
    userWalletBalance: BigNumber.from(0),
    userETHBalance: BigNumber.from(defaultValue),
};

export const ZeroUserETHBalance = Template.bind({});
ZeroUserETHBalance.args = {
    ...Default.args,
    userWalletBalance: BigNumber.from(defaultValue),
    userETHBalance: BigNumber.from(0),
};

export const ZeroUserWalletBalanceAndZeroUserETHBalance = Template.bind({});
ZeroUserWalletBalanceAndZeroUserETHBalance.args = {
    ...Default.args,
    userWalletBalance: BigNumber.from(0),
    userETHBalance: BigNumber.from(0),
};
