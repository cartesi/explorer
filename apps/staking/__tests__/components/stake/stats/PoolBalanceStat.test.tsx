// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BigNumber } from 'ethers';
import PoolBalanceStat, {
    PoolBalanceStatProps,
} from '../../../../src/components/stake/stats/PoolBalanceStat';
import { withChakraTheme } from '../../../test-utilities';

const defaultValue = '10000000000000000000000000000';

const EPoolBalanceStat = withChakraTheme<PoolBalanceStatProps>(PoolBalanceStat);

describe('Pool Balance Stat', () => {
    // a default configured component
    const renderComponent = () =>
        render(<EPoolBalanceStat pool={BigNumber.from(defaultValue)} />);

    it('Should display pool balance label', () => {
        renderComponent();
        expect(screen.getByText('Pool Balance')).toBeInTheDocument();
    });

    it('Should display required text for balance tooltip', async () => {
        renderComponent();
        const text =
            'Amount of tokens available at the pool contract either for stake or withdraw';

        const icon = screen.getByRole('balance-icon');
        await act(() => {
            userEvent.hover(icon);
        });

        await screen.findByText(text);
        expect(screen.getByText(text)).toBeInTheDocument();
    });
});
