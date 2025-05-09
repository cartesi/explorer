// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import {
    IStakingUnstakeModalProps,
    StakingUnstakeModal,
} from '../../../../src/components/stake/modals/StakingUnstakeModal';
import { withChakraTheme } from '../../../test-utilities';
import userEvent from '@testing-library/user-event';

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

    it('Should invoke onSave callback for full amount', () => {
        const onSave = jest.fn();
        const { getByRole } = render(
            <EStakingUnstakeModal {...defaultProps} onSave={onSave} />
        );

        const button = getByRole('unstake-button');

        fireEvent.click(button);

        expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith('full');
    });

    it('Should invoke onSave callback after partial amount is set', async () => {
        const onSave = jest.fn();
        const { getByRole, getByText } = render(
            <EStakingUnstakeModal {...defaultProps} onSave={onSave} />
        );

        const input = getByText('Partial amount')
            .closest('label')
            .querySelector('input');

        fireEvent.click(input);

        await waitFor(() =>
            expect(getByRole('spinbutton')).toBeInTheDocument()
        );

        const numberInput = getByRole('spinbutton');

        fireEvent.focus(numberInput);
        await userEvent.type(numberInput, '10000', { delay: 0 });
        await waitFor(() => expect(numberInput).toHaveValue('10000'));

        const button = getByRole('unstake-button');

        await waitFor(() => {
            expect(button.hasAttribute('disabled')).toBe(false);
        });

        fireEvent.click(button);

        expect(onSave).toHaveBeenCalled();
        expect(onSave).toHaveBeenCalledWith('partial', parseUnits('10000', 18));
    });

    it('Should disable stake button when partial amount is selected', async () => {
        const { getByRole, getByText } = render(
            <EStakingUnstakeModal {...defaultProps} />
        );

        const input = getByText('Partial amount')
            .closest('label')
            .querySelector('input');

        fireEvent.click(input);

        await waitFor(() =>
            expect(getByRole('unstake-button')).toBeInTheDocument()
        );

        expect(getByRole('unstake-button')).toBeDisabled();
    });
});
