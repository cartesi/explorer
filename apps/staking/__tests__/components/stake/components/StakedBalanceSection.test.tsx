// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen, fireEvent } from '@testing-library/react';
import { BigNumber } from 'ethers';
import {
    IStakedBalanceSection,
    StakedBalanceSection,
} from '../../../../src/components/stake/components/StakedBalanceSection';
import { parseCtsiValue } from '../../../../src/components/pools/staking/CTSI';
import { withChakraTheme } from '../../../test-utilities';

const defaultValue = '10000000000000000000000000000';
const defaultOnUnstakeClick = () => undefined;

const EPoolBalanceSection =
    withChakraTheme<IStakedBalanceSection>(StakedBalanceSection);

describe('Staked Balance Section', () => {
    // a default configured component
    const renderComponent = () =>
        render(
            <EPoolBalanceSection
                stakedBalance={BigNumber.from(defaultValue)}
                onUnstakeClick={defaultOnUnstakeClick}
            />
        );

    it('Should display staked balance label', () => {
        renderComponent();
        expect(screen.getByText('Your staked balance')).toBeInTheDocument();
    });

    it('Should display correct stakedBalance value', () => {
        renderComponent();

        expect(screen.getByRole('ctsi-text')).toHaveTextContent(
            parseCtsiValue(BigNumber.from(defaultValue))
        );
    });

    it('Should disable unstake button when stakedBalance is zero', () => {
        const { getByText } = render(
            <EPoolBalanceSection
                stakedBalance={BigNumber.from(0)}
                onUnstakeClick={defaultOnUnstakeClick}
            />
        );

        expect(getByText('Unstake').closest('button')).toBeDisabled();
    });

    it('Should enable unstake button when stakedBalance is above zero', () => {
        const { getByText } = render(
            <EPoolBalanceSection
                stakedBalance={BigNumber.from(defaultValue)}
                onUnstakeClick={defaultOnUnstakeClick}
            />
        );

        expect(getByText('Unstake').closest('button')).toBeEnabled();
    });

    it('Should invoke onUnstakeClick callback', () => {
        const mockOnClick = jest.fn();
        const { getByText } = render(
            <EPoolBalanceSection
                stakedBalance={BigNumber.from(defaultValue)}
                onUnstakeClick={mockOnClick()}
            />
        );

        const button = getByText('Unstake').closest('button');

        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
