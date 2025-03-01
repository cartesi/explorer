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
import { TransactionInfoBanner } from '../../components/stake/TransactionInfoBanner';

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
    title: 'Stake/TransactionInfoBanner',
    component: TransactionInfoBanner,
    argTypes: {},
} as ComponentMeta<typeof TransactionInfoBanner>;

const Template: ComponentStory<typeof TransactionInfoBanner> = (args) => (
    <TransactionInfoBanner {...args} />
);

export const Default = Template.bind({});
Default.args = {
    title: 'Deposit set',
    failTitle: 'Error setting allowance',
    successDescription: 'New allowance set successfully',
    transaction: defaultTransaction,
    onBeginTransaction: () => {
        console.log('onBeginTransaction::');
    },
    onEndTransaction: () => {
        console.log('onEndTransaction::');
    },
    onSuccess: () => {
        console.log('onSuccess::');
    },
    onError: () => {
        console.log('onError::');
    },
};

export const Loading = Template.bind({});
Loading.args = {
    ...Default.args,
    title: 'Setting deposit...',
    transaction: null,
};

export const TransactionError = Template.bind({});
TransactionError.args = {
    ...Default.args,
    transaction: {
        ...defaultTransaction,
        error: true,
    },
};

export const WithoutHash = Template.bind({});
WithoutHash.args = {
    ...Default.args,
    transaction: {
        ...defaultTransaction,
        transaction: {
            ...defaultTransaction.transaction,
            hash: undefined,
        },
    },
};
