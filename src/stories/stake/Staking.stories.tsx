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
import { Staking } from '../../components/stake/Staking';
import { BigNumber } from 'ethers';

const defaultValue = '1000000000000000000000';

const defaultTransaction = {
    acknowledged: false,
    error: null,
    receipt: {
        confirmations: 1,
    },
    transaction: {
        hash: '0x6200d8606aab695a7f730a3f7c60e399eb3bd10f',
        chainId: '3124123',
    },
};

export default {
    title: 'Stake/Staking',
    component: Staking,
    argTypes: {},
} as ComponentMeta<typeof Staking>;

const Template: ComponentStory<typeof Staking> = (args) => (
    <Staking {...args} />
);

export const Default = Template.bind({});
Default.args = {
    userWalletBalance: BigNumber.from(defaultValue),
    allowance: BigNumber.from(defaultValue),
    userPoolBalance: BigNumber.from(defaultValue),
    userETHBalance: BigNumber.from(defaultValue),
    stakedBalance: BigNumber.from(defaultValue),
    depositTimestamp: new Date(new Date().setFullYear(2023)),
    lockTime: 1000,
    poolTransaction: defaultTransaction,
    tokenTransaction: defaultTransaction,
    onApprove: () => undefined,
    onDeposit: () => undefined,
    onWithdraw: () => undefined,
    onStake: () => undefined,
    onUnstake: () => undefined,
};
