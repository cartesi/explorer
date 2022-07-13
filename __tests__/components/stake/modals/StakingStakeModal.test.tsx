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
    StakingStakeModal,
    IStakingStakeModalProps,
} from '../../../../src/components/stake/modals/StakingStakeModal';
import { withChakraTheme } from '../../../test-utilities';
import { BigNumber } from 'ethers';

const defaultValue = '100000000000000000000000';

const defaultProps = {
    balance: BigNumber.from(defaultValue),
    userBalance: BigNumber.from(defaultValue),
    disclosure: {
        onClose: () => undefined,
    },
    isOpen: true,
    onClose: () => undefined,
    onSave: () => undefined,
};

const EStakingStakeModal =
    withChakraTheme<IStakingStakeModalProps>(StakingStakeModal);

describe('Staking Stake Modal', () => {
    // a default configured component
    const renderComponent = () =>
        render(<EStakingStakeModal {...defaultProps} />);

    it('Should display moving your tokens label', () => {
        renderComponent();

        expect(
            screen.getByText(
                "By moving your tokens from the pool balance to your staked balance. Your staked tokens contribute to the pool's staking power, which in turn will automatically generate rewards. Learn more"
            )
        ).toBeInTheDocument();
    });

    it('Should not display modal when closed', () => {
        render(<EStakingStakeModal {...defaultProps} isOpen={false} />);

        expect(() =>
            screen.getByText(
                "By moving your tokens from the pool balance to your staked balance. Your staked tokens contribute to the pool's staking power, which in turn will automatically generate rewards. Learn more"
            )
        ).toThrow('Unable to find an element');
    });

    it('Should invoke onClose callback', () => {
        const mockOnClick = jest.fn();
        const { getByText } = render(
            <EStakingStakeModal {...defaultProps} onClose={mockOnClick()} />
        );

        const button = getByText('Cancel').closest('button');

        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('Should invoke onSave callback', () => {
        let isSavedTriggered = false;
        const { getByRole } = render(
            <EStakingStakeModal
                {...defaultProps}
                onSave={() => {
                    isSavedTriggered = true;
                }}
            />
        );

        const button = getByRole('stake-button');

        fireEvent.click(button);

        expect(isSavedTriggered).toBe(true);
    });

    it('Should disable stake button when stake is zero', () => {
        const { getByRole } = render(
            <EStakingStakeModal
                {...defaultProps}
                userBalance={BigNumber.from(0)}
            />
        );

        expect(getByRole('stake-button')).toBeDisabled();
    });

    it('Should enable stake button when stake is above zero', () => {
        const { getByRole } = renderComponent();

        expect(getByRole('stake-button')).toBeEnabled();
    });
});
