// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BigNumber } from 'ethers';
import StakedBalanceStat, {
    StakedBalanceStatProps,
} from '../../../../src/components/stake/stats/StakedBalanceStat';
import { withChakraTheme } from '../../../test-utilities';

const defaultValue = '10000000000000000000000000000';

const EStakedBalanceStat =
    withChakraTheme<StakedBalanceStatProps>(StakedBalanceStat);

describe('Staked Balance Stat', () => {
    // a default configured component
    const renderComponent = () =>
        render(
            <EStakedBalanceStat stakedBalance={BigNumber.from(defaultValue)} />
        );

    it('Should display staked balance label', () => {
        renderComponent();
        expect(screen.getByText('Staked Balance')).toBeInTheDocument();
    });

    it('Should display balance icon', () => {
        renderComponent();

        expect(screen.getByRole('balance-icon')).toBeInTheDocument();
    });

    it('Should display required text  for balance tooltip', async () => {
        renderComponent();
        const text = 'Total amount of tokens staked in this pool';

        const icon = screen.getByRole('balance-icon');
        await act(() => {
            userEvent.hover(icon);
        });

        await screen.findByText(text);
        expect(screen.getByText(text)).toBeInTheDocument();
    });
});
