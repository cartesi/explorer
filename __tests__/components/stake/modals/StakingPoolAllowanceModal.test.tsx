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
    StakingPoolAllowanceModal,
    IStakingPoolAllowanceModalProps,
} from '../../../../src/components/stake/modals/StakingPoolAllowanceModal';
import { withChakraTheme } from '../../../test-utilities';
import { BigNumber } from 'ethers';

const defaultValue = '100000000000000000000000';

const defaultProps = {
    allowance: BigNumber.from(defaultValue),
    balance: BigNumber.from(defaultValue),
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

const EStakingPoolAllowanceModal =
    withChakraTheme<IStakingPoolAllowanceModalProps>(StakingPoolAllowanceModal);

describe('Staking Pool Allowance Modal', () => {
    // a default configured component
    const renderComponent = () =>
        render(<EStakingPoolAllowanceModal {...defaultProps} />);

    it('Should display allowance label', () => {
        renderComponent();

        expect(screen.getByText('Edit pool allowance')).toBeInTheDocument();
    });

    it('Should not display modal when closed', () => {
        render(<EStakingPoolAllowanceModal {...defaultProps} isOpen={false} />);

        expect(() => screen.getByText('Edit pool allowance')).toThrow(
            'Unable to find an element'
        );
    });

    it('Should invoke onClose callback', () => {
        const mockOnClick = jest.fn();
        const { getByText } = render(
            <EStakingPoolAllowanceModal
                {...defaultProps}
                onClose={mockOnClick()}
            />
        );

        const button = getByText('Cancel').closest('button');

        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('Should invoke onSave callback', () => {
        let isSavedTriggered = false;
        const { getByText } = render(
            <EStakingPoolAllowanceModal
                {...defaultProps}
                onSave={() => {
                    isSavedTriggered = true;
                }}
            />
        );

        const button = getByText('Save').closest('button');

        fireEvent.click(button);

        expect(isSavedTriggered).toBe(true);
    });
});
