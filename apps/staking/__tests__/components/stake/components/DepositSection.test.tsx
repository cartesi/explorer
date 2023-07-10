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
    DepositSection,
    IDepositSection,
} from '../../../../src/components/stake/components/DepositSection';
import { withChakraTheme } from '../../../test-utilities';
import { useWallet } from '@explorer/wallet/src/useWallet';

jest.mock('@explorer/wallet/src/useWallet');

const defaultValue = '10000000000000000000000000000';
const defaultOnDepositClick = () => undefined;

const EDepositSection = withChakraTheme<IDepositSection>(DepositSection);

const useWalletMock = useWallet as jest.MockedFunction<typeof useWallet>;

describe('Deposit Section', () => {
    // a default configured component
    const renderComponent = () =>
        render(
            <EDepositSection
                userWalletBalance={BigNumber.from(defaultValue)}
                userETHBalance={BigNumber.from(defaultValue)}
                onDepositClick={defaultOnDepositClick}
            />
        );

    const dummyWallet = {
        active: true,
        activate: () => null,
        deactivate: () => null,
    };

    beforeEach(() => {
        useWalletMock.mockReturnValue({ ...dummyWallet });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('Should display staking label', () => {
        renderComponent();
        expect(screen.getByText('Staking')).toBeInTheDocument();
    });

    it('Should display deposit button', () => {
        renderComponent();
        expect(screen.getByText('Deposit')).toBeInTheDocument();
    });

    it('Should display deposit your tokens label', () => {
        renderComponent();
        expect(
            screen.getByText("Let's deposit your tokens to the pool!")
        ).toBeInTheDocument();
    });

    it('Should display add CTSI to deposit label', () => {
        render(
            <EDepositSection
                userWalletBalance={BigNumber.from(0)}
                userETHBalance={BigNumber.from(defaultValue)}
                onDepositClick={defaultOnDepositClick}
            />
        );

        expect(
            screen.getByText('You have 0 CTSI. Please, add CTSI to deposit.')
        ).toBeInTheDocument();
    });

    it('Should display add CTSI to deposit label', () => {
        render(
            <EDepositSection
                userWalletBalance={BigNumber.from(defaultValue)}
                userETHBalance={BigNumber.from(0)}
                onDepositClick={defaultOnDepositClick}
            />
        );

        expect(
            screen.getByText(
                "You have 0 ETH. You'll need ETH for transaction fees."
            )
        ).toBeInTheDocument();
    });

    it('Should disable deposit button when userWalletBalance is zero', () => {
        const { getByText } = render(
            <EDepositSection
                userWalletBalance={BigNumber.from(0)}
                userETHBalance={BigNumber.from(defaultValue)}
                onDepositClick={defaultOnDepositClick}
            />
        );

        expect(getByText('Deposit').closest('button')).toBeDisabled();
    });

    it('Should disable deposit button when userETHBalance is zero', () => {
        const { getByText } = render(
            <EDepositSection
                userWalletBalance={BigNumber.from(defaultValue)}
                userETHBalance={BigNumber.from(0)}
                onDepositClick={defaultOnDepositClick}
            />
        );

        expect(getByText('Deposit').closest('button')).toBeDisabled();
    });

    it('Should not disable deposit button when user-eth-balance is zero but the wallet is gnosis-safe', () => {
        useWalletMock.mockReturnValue({ ...dummyWallet, isGnosisSafe: true });
        render(
            <EDepositSection
                userWalletBalance={BigNumber.from(defaultValue)}
                userETHBalance={BigNumber.from(0)}
                onDepositClick={defaultOnDepositClick}
            />
        );

        expect(screen.getByText('Deposit').closest('button')).toBeEnabled();
    });

    it('Should enable deposit button when userWalletBalance and userETHBalance are above zero', () => {
        const { getByText } = render(
            <EDepositSection
                userWalletBalance={BigNumber.from(defaultValue)}
                userETHBalance={BigNumber.from(defaultValue)}
                onDepositClick={defaultOnDepositClick}
            />
        );

        expect(getByText('Deposit').closest('button')).toBeEnabled();
    });

    it('Should invoke onDepositClick callback', () => {
        const mockOnClick = jest.fn();
        const { getByText } = render(
            <EDepositSection
                userWalletBalance={BigNumber.from(defaultValue)}
                userETHBalance={BigNumber.from(defaultValue)}
                onDepositClick={mockOnClick()}
            />
        );

        const button = getByText('Deposit').closest('button');

        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
