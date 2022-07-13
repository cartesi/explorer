// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BigNumber } from 'ethers';
import {
    IPoolBalanceSectionProps,
    PoolBalanceSection,
} from '../../../../src/components/stake/components/PoolBalanceSection';
import { parseCtsiValue } from '../../../../src/components/pools/staking/CTSI';
import { withChakraTheme } from '../../../test-utilities';

const defaultValue = '10000000000000000000000000000';
const defaultOnStakeClick = () => undefined;
const defaultOnWithdrawClick = () => undefined;

const EPoolBalanceSection =
    withChakraTheme<IPoolBalanceSectionProps>(PoolBalanceSection);

describe('Deposit Section', () => {
    // a default configured component
    const renderComponent = () =>
        render(
            <EPoolBalanceSection
                userPoolBalance={BigNumber.from(defaultValue)}
                isPoolBalanceLocked={false}
                onStakeClick={defaultOnStakeClick}
                onWithdrawClick={defaultOnWithdrawClick}
            />
        );

    it('Should display pool balance label', () => {
        renderComponent();
        expect(screen.getByText('Your pool balance')).toBeInTheDocument();
    });

    it('Should display currently locked pool balance label', () => {
        render(
            <EPoolBalanceSection
                userPoolBalance={BigNumber.from(defaultValue)}
                isPoolBalanceLocked
                onStakeClick={defaultOnStakeClick}
                onWithdrawClick={defaultOnWithdrawClick}
            />
        );

        expect(
            screen.getByText('Your pool balance (currently locked)')
        ).toBeInTheDocument();
    });

    it('Should display correct userPoolBalance value', () => {
        renderComponent();

        expect(screen.getByRole('ctsi-text')).toHaveTextContent(
            parseCtsiValue(BigNumber.from(defaultValue))
        );
    });

    it('Should disable stake button when pool balance is locked', () => {
        const { getByText } = render(
            <EPoolBalanceSection
                userPoolBalance={BigNumber.from(defaultValue)}
                isPoolBalanceLocked
                onStakeClick={defaultOnStakeClick}
                onWithdrawClick={defaultOnWithdrawClick}
            />
        );

        expect(getByText('Stake').closest('button')).toBeDisabled();
    });

    it('Should disable stake button when userPoolBalance is zero', () => {
        const { getByText } = render(
            <EPoolBalanceSection
                userPoolBalance={BigNumber.from(0)}
                isPoolBalanceLocked={false}
                onStakeClick={defaultOnStakeClick}
                onWithdrawClick={defaultOnWithdrawClick}
            />
        );

        expect(getByText('Stake').closest('button')).toBeDisabled();
    });

    it('Should disable withdraw button when userPoolBalance is zero', () => {
        const { getByText } = render(
            <EPoolBalanceSection
                userPoolBalance={BigNumber.from(0)}
                isPoolBalanceLocked={false}
                onStakeClick={defaultOnStakeClick}
                onWithdrawClick={defaultOnWithdrawClick}
            />
        );

        expect(getByText('Withdraw').closest('button')).toBeDisabled();
    });

    it('Should enable stake button when userPoolBalance and userETHBalance are above zero', () => {
        const { getByText } = render(
            <EPoolBalanceSection
                userPoolBalance={BigNumber.from(defaultValue)}
                isPoolBalanceLocked={false}
                onStakeClick={defaultOnStakeClick}
                onWithdrawClick={defaultOnWithdrawClick}
            />
        );

        expect(getByText('Stake').closest('button')).toBeEnabled();
    });

    it('Should enable withdraw button when userPoolBalance is above zero', () => {
        const { getByText } = render(
            <EPoolBalanceSection
                userPoolBalance={BigNumber.from(defaultValue)}
                isPoolBalanceLocked={false}
                onStakeClick={defaultOnStakeClick}
                onWithdrawClick={defaultOnWithdrawClick}
            />
        );

        expect(getByText('Withdraw').closest('button')).toBeEnabled();
    });

    it('Should invoke onStakeClick callback', () => {
        const mockOnClick = jest.fn();
        const { getByText } = render(
            <EPoolBalanceSection
                userPoolBalance={BigNumber.from(defaultValue)}
                isPoolBalanceLocked={false}
                onStakeClick={mockOnClick()}
                onWithdrawClick={defaultOnWithdrawClick}
            />
        );

        const button = getByText('Stake').closest('button');

        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('Should invoke onWithdrawClick callback', () => {
        const mockOnClick = jest.fn();
        const { getByText } = render(
            <EPoolBalanceSection
                userPoolBalance={BigNumber.from(defaultValue)}
                isPoolBalanceLocked={false}
                onStakeClick={defaultOnStakeClick}
                onWithdrawClick={mockOnClick()}
            />
        );

        const button = getByText('Withdraw').closest('button');

        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
