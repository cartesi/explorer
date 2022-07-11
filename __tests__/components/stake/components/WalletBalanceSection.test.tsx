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
    IWalletBalanceSectionProps,
    WalletBalanceSection,
} from '../../../../src/components/stake/components/WalletBalanceSection';
import { parseCtsiValue } from '../../../../src/components/pools/staking/CTSI';
import { withChakraTheme } from '../../../test-utilities';

const defaultValue = '10000000000000000000000000000';

const EWalletBalanceSection =
    withChakraTheme<IWalletBalanceSectionProps>(WalletBalanceSection);

describe('Wallet Balance Section', () => {
    // a default configured component
    const renderComponent = () =>
        render(
            <EWalletBalanceSection
                userCTSIBalance={BigNumber.from(defaultValue)}
                userETHBalance={BigNumber.from(defaultValue)}
            />
        );

    it('Should display wallet balance label', () => {
        renderComponent();
        expect(screen.getByText('Wallet balance')).toBeInTheDocument();
    });

    it('Should display not enough ETH when userETHBalance is zero', () => {
        const { getByText } = render(
            <EWalletBalanceSection
                userCTSIBalance={BigNumber.from(defaultValue)}
                userETHBalance={BigNumber.from(0)}
            />
        );

        expect(
            getByText(
                "You don't have enough ETH in your wallet for the transaction fee."
            )
        ).toBeInTheDocument();
    });

    it('Should not display not enough ETH when userETHBalance is above zero', () => {
        const { getByText } = render(
            <EWalletBalanceSection
                userCTSIBalance={BigNumber.from(defaultValue)}
                userETHBalance={BigNumber.from(defaultValue)}
            />
        );

        expect(() =>
            getByText(
                "You don't have enough ETH in your wallet for the transaction fee."
            )
        ).toThrow('Unable to find an element');
    });

    it('Should display correct userCTSIBalance value', () => {
        renderComponent();

        expect(screen.getByRole('ctsi-text')).toHaveTextContent(
            parseCtsiValue(BigNumber.from(defaultValue))
        );
    });
});
