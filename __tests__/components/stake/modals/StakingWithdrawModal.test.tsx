// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    StakingWithdrawModal,
    IStakingWithdrawModalProps,
} from '../../../../src/components/stake/modals/StakingWithdrawModal';
import { withChakraTheme } from '../../../test-utilities';
import { BigNumber } from 'ethers';

const defaultValue = '100000000000000000000000';

const defaultProps = {
    userBalance: BigNumber.from(defaultValue),
    disclosure: {
        onClose: () => {
            console.log('disclosure::onClose::');
        },
    },
    isOpen: true,
    onClose: () => {
        console.log('onClose::');
    },
    onSave: () => {
        console.log('onSave::');
    },
};

const EStakingWithdrawModal =
    withChakraTheme<IStakingWithdrawModalProps>(StakingWithdrawModal);

describe('Staking Withdraw Modal', () => {
    // a default configured component
    const renderComponent = () =>
        render(<EStakingWithdrawModal {...defaultProps} />);

    it('Should display withdraw label', () => {
        renderComponent();

        expect(
            screen.getByText('Withdraw from the pool balance to your wallet')
        ).toBeInTheDocument();
    });

    it('Should not display modal when closed', () => {
        render(<EStakingWithdrawModal {...defaultProps} isOpen={false} />);

        expect(() =>
            screen.getByText('Withdraw from the pool balance to your wallet')
        ).toThrow('Unable to find an element');
    });

    it('Should invoke onClose callback', () => {
        const mockOnClick = jest.fn();
        const { getByText } = render(
            <EStakingWithdrawModal {...defaultProps} onClose={mockOnClick()} />
        );

        const button = getByText('Cancel').closest('button');

        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('Should invoke onSave callback', () => {
        let isSavedTriggered = false;
        const { getByRole } = render(
            <EStakingWithdrawModal
                {...defaultProps}
                onSave={() => {
                    isSavedTriggered = true;
                }}
            />
        );

        const button = getByRole('withdraw-button');

        fireEvent.click(button);

        expect(isSavedTriggered).toBe(true);
    });

    it('Should disable withdraw button when partial amount is selected', () => {
        const { getByRole, getByText } = render(
            <EStakingWithdrawModal {...defaultProps} />
        );

        const input = getByText('Partial amount')
            .closest('label')
            .querySelector('input');

        fireEvent.click(input);

        expect(getByRole('withdraw-button')).toBeDisabled();
    });
});
