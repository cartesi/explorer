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
    StakingUnstakeModal,
    IStakingUnstakeModalProps,
} from '../../../../src/components/stake/modals/StakingUnstakeModal';
import { withChakraTheme } from '../../../test-utilities';
import { BigNumber } from 'ethers';

const defaultValue = '100000000000000000000000';

const defaultProps = {
    stakedBalance: BigNumber.from(defaultValue),
    disclosure: {
        onClose: () => undefined,
    },
    isOpen: true,
    onClose: () => undefined,
    onSave: () => undefined,
};

const EStakingUnstakeModal =
    withChakraTheme<IStakingUnstakeModalProps>(StakingUnstakeModal);

describe('Staking Unstake Modal', () => {
    // a default configured component
    const renderComponent = () =>
        render(<EStakingUnstakeModal {...defaultProps} />);

    it('Should display unstake label', () => {
        renderComponent();

        expect(screen.getByText('Unstake to withdraw')).toBeInTheDocument();
    });

    it('Should not display modal when closed', () => {
        render(<EStakingUnstakeModal {...defaultProps} isOpen={false} />);

        expect(() => screen.getByText('Unstake to withdraw')).toThrow(
            'Unable to find an element'
        );
    });

    it('Should invoke onClose callback', () => {
        const mockOnClick = jest.fn();
        const { getByText } = render(
            <EStakingUnstakeModal {...defaultProps} onClose={mockOnClick()} />
        );

        const button = getByText('Cancel').closest('button');

        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('Should invoke onSave callback', () => {
        let isSavedTriggered = false;
        const { getByRole } = render(
            <EStakingUnstakeModal
                {...defaultProps}
                onSave={() => {
                    isSavedTriggered = true;
                }}
            />
        );

        const button = getByRole('unstake-button');

        fireEvent.click(button);

        expect(isSavedTriggered).toBe(true);
    });

    it('Should disable stake button when partial amount is selected', () => {
        const { getByRole, getByText } = render(
            <EStakingUnstakeModal {...defaultProps} />
        );

        const input = getByText('Partial amount')
            .closest('label')
            .querySelector('input');

        fireEvent.click(input);

        expect(getByRole('unstake-button')).toBeDisabled();
    });
});
