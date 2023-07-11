// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { BigNumber } from 'ethers';
import userEvent from '@testing-library/user-event';
import PoolsOverview from '../../../../src/components/stake/components/PoolsOverview';
import { withChakraTheme } from '../../../test-utilities';

const Component = withChakraTheme(PoolsOverview);
const props = {
    balance: BigNumber.from('10000'),
    poolBalancesCount: 10,
    summary: {
        id: '1',
        totalUsers: 2,
        totalPools: 3,
        totalStakers: 4,
        totalNodes: 5,
        totalStaked: '600000',
        totalBlocks: 7,
        totalReward: '800000',
        totalProtocols: 9,
        totalChains: 10,
    },
};

describe('PoolsOverview Section', () => {
    it('should pass until refactoring is done', () => {
        expect(true).toBe(true);
    });
    // TODO: Uncomment tests after staking ethers library is upgraded to the same version as in packages/ui
    // it('Should display total tooltip', async () => {
    //     render(<Component {...props} />);
    //     const text = 'Total number of pools';
    //
    //     const icon = screen.getByTestId('pools-overview-total-tooltip');
    //     await act(() => {
    //         userEvent.hover(icon);
    //     });
    //
    //     await screen.findByText(text);
    //     expect(screen.getByText(text)).toBeInTheDocument();
    // });
    //
    // it('Should display balances tooltip', async () => {
    //     render(<Component {...props} />);
    //     const text = 'Number of pools user staked';
    //
    //     const icon = screen.getByTestId('pools-overview-balances-tooltip');
    //     await act(() => {
    //         userEvent.hover(icon);
    //     });
    //
    //     await screen.findByText(text);
    //     expect(screen.getByText(text)).toBeInTheDocument();
    // });
    //
    // it('Should display total tooltip', async () => {
    //     render(<Component {...props} />);
    //     const text = 'Total user stake in pools';
    //
    //     const icon = screen.getByTestId('pools-overview-stake-tooltip');
    //     await act(() => {
    //         userEvent.hover(icon);
    //     });
    //
    //     await screen.findByText(text);
    //     expect(screen.getByText(text)).toBeInTheDocument();
    // });
});
