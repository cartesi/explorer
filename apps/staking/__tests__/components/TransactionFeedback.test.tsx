// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen, fireEvent } from '@testing-library/react';
import TransactionFeedback from '../../src/components/TransactionFeedback';
import { Transaction } from '../../src/services/transaction';
import { withChakraTheme } from '../test-utilities';
import { ContractTransaction } from 'ethers';

const Component = withChakraTheme(TransactionFeedback);
const props = {
    transaction: {
        submitting: false,
        acknowledged: false,
        set: jest.fn(),
        ack: jest.fn(),
    } as Transaction<string>,
};

describe('TransactionFeedback component', () => {
    it('should trigger ack callback when close button is clicked', () => {
        const mockedAck = jest.fn();
        render(
            <Component transaction={{ ...props.transaction, ack: mockedAck }} />
        );
        const button = screen.getByTestId('transaction-feedback-close-button');

        fireEvent.click(button);

        expect(mockedAck).toHaveBeenCalled();
    });

    it('should display transaction error', () => {
        const error = 'Some error';
        render(<Component transaction={{ ...props.transaction, error }} />);

        expect(screen.getByText(error)).toBeInTheDocument();
    });

    it('should not display transaction if it is already acknowledged', () => {
        const content = 'Some content';
        render(
            <Component
                transaction={{ ...props.transaction, acknowledged: true }}
            />
        );

        expect(() => screen.getByText(content)).toThrow(
            'Unable to find an element'
        );
    });

    it('should display address if transaction hash is provided', () => {
        const transaction = {
            ...props.transaction,
            transaction: {
                hash: '0x6200d8606aab695a7f730a3f7c60e399eb3bd10f',
            } as ContractTransaction,
        };
        render(<Component transaction={{ ...transaction }} />);

        expect(screen.getByTestId('address')).toBeInTheDocument();
    });
});
