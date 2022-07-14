// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { render, screen } from '@testing-library/react';
import { TransactionInfoBanner } from '../../../src/components/stake/TransactionInfoBanner';
import { withChakraTheme } from '../../test-utilities';
import { Transaction } from '../../../src/services/transaction';
import { ContractReceipt, ContractTransaction } from 'ethers';

const defaultTransaction: Transaction<any> = {
    ack: jest.fn(),
    acknowledged: false,
    error: undefined,
    receipt: undefined,
    result: undefined,
    set: jest.fn(),
    submitting: false,
    transaction: {
        hash: '0x6200d8606aab695a7f730a3f7c60e399eb3bd10f',
        chainId: 1823981,
    } as ContractTransaction,
};

const successTransaction: Transaction<any> = {
    ...defaultTransaction,
    receipt: {
        confirmations: 1,
    } as ContractReceipt,
};

const errorTransaction = {
    ...defaultTransaction,
    error: 'Some error',
};

const defaultProps = {
    title: 'Transaction info banner title',
    failTitle: 'Transaction info banner fail title',
    successDescription: 'Success',
    transaction: defaultTransaction,
    onBeginTransaction: () => undefined,
    onEndTransaction: () => undefined,
    onSuccess: () => undefined,
    onError: () => undefined,
};

const ETransactionInfoBanner = withChakraTheme(TransactionInfoBanner);

describe('Transaction Info Banner', () => {
    // a default configured component
    const renderComponent = () =>
        render(<ETransactionInfoBanner {...defaultProps} />);

    it('Should display title', () => {
        renderComponent();
        expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    });

    it('Should display error', () => {
        render(
            <ETransactionInfoBanner
                {...defaultProps}
                transaction={{
                    ...defaultTransaction,
                    error: 'Some error',
                }}
            />
        );
        expect(screen.getByText(errorTransaction.error)).toBeInTheDocument();
    });

    it('Should display success', () => {
        render(
            <ETransactionInfoBanner
                {...defaultProps}
                transaction={successTransaction}
            />
        );
        expect(
            screen.getByText(defaultProps.successDescription)
        ).toBeInTheDocument();
    });

    it('Should invoke onSuccess callback', () => {
        let isTriggered = false;
        render(
            <ETransactionInfoBanner
                {...defaultProps}
                transaction={successTransaction}
                onSuccess={() => {
                    isTriggered = true;
                }}
            />
        );

        expect(isTriggered).toBe(true);
    });

    it('Should invoke onError callback', () => {
        let isTriggered = false;
        render(
            <ETransactionInfoBanner
                {...defaultProps}
                transaction={errorTransaction}
                onError={() => {
                    isTriggered = true;
                }}
            />
        );

        expect(isTriggered).toBe(true);
    });
});
