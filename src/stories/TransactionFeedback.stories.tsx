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

import TransactionFeedback from '../components/TransactionFeedback';
import { Transaction } from '../services/transaction';

export default {
    title: 'TransactionFeedback',
    component: TransactionFeedback,
    argTypes: {},
} as Meta<typeof TransactionFeedback>;

type Story = StoryObj<typeof TransactionFeedback>;

const Template: Story = {
    render: (args) => (
        <TransactionFeedback {...args}>Creating pool...</TransactionFeedback>
    ),
};

export const NoHashYet: Story = {
    args: {
        transaction: {
            transaction: {
                confirmations: 0,
            },
        } as Transaction<string>,
    },
    ...Template,
};

export const WithHash: Story = {
    args: {
        transaction: {
            transaction: {
                chainId: 5,
                hash: '0x06d88982458952d7e39e6ebd85ce6b9873b9721fd1fc656e0eb943e9afe75560',
                confirmations: 0,
            },
        } as Transaction<string>,
    },
    ...Template,
};

export const Confirmations: Story = {
    args: {
        transaction: {
            transaction: {
                chainId: 5,
                hash: '0x06d88982458952d7e39e6ebd85ce6b9873b9721fd1fc656e0eb943e9afe75560',
            },
            receipt: {
                confirmations: 1 / 3,
            },
        } as Transaction<string>,
    },
    ...Template,
};

export const Done: Story = {
    args: {
        transaction: {
            transaction: {
                chainId: 5,
                hash: '0x06d88982458952d7e39e6ebd85ce6b9873b9721fd1fc656e0eb943e9afe75560',
            },
            receipt: {
                confirmations: 1,
            },
        } as Transaction<string>,
    },
    ...Template,
};

export const Error: Story = {
    args: {
        transaction: {
            transaction: {
                chainId: 5,
            },
            receipt: {
                confirmations: 0,
            },
            error: 'Transaction not found',
        } as Transaction<string>,
    },
    ...Template,
};

export const ErrorRevert: Story = {
    args: {
        transaction: {
            transaction: {
                chainId: 5,
                hash: '0x06d88982458952d7e39e6ebd85ce6b9873b9721fd1fc656e0eb943e9afe75560',
            },
            receipt: {
                confirmations: 0,
            },
            error: 'Invalid fee',
        } as Transaction<string>,
    },
    ...Template,
};
