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
import { TransactionInfoBanner } from '../../components/stake/TransactionInfoBanner';
import { Transaction } from '../../services/transaction';

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
} as Meta<typeof TransactionInfoBanner>;

type Story = StoryObj<typeof TransactionInfoBanner>;

const Template: Story = {
    render: (args) => <TransactionInfoBanner {...args} />,
};

export const Default: Story = {
    args: {
        title: 'Deposit set',
        failTitle: 'Error setting allowance',
        successDescription: 'New allowance set successfully',
        transaction: defaultTransaction as unknown as Transaction<string>,
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
    },
    ...Template,
};

export const Loading: Story = {
    args: {
        ...Default.args,
        title: 'Setting deposit...',
        transaction: null,
    },
    ...Template,
};

export const TransactionError: Story = {
    args: {
        ...Default.args,
        transaction: {
            ...defaultTransaction,
            error: '',
        } as unknown as Transaction<string>,
    },
    ...Template,
};

export const WithoutHash: Story = {
    args: {
        ...Default.args,
        transaction: {
            ...defaultTransaction,
            transaction: {
                ...defaultTransaction.transaction,
                hash: undefined,
            },
        } as unknown as Transaction<string>,
    },
    ...Template,
};
