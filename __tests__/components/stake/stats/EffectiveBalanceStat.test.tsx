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
import EffectiveBalanceStat, {
    EffectiveBalanceStatProps,
} from '../../../../src/components/stake/stats/EffectiveBalanceStat';
import { withChakraTheme } from '../../../test-utilities';

const defaultValue = '10000000000000000000000000000';
const defaultProps = {
    stake: BigInt(defaultValue),
    unstake: BigInt(defaultValue),
    withdraw: BigInt(defaultValue),
    stakingMature: BigInt(defaultValue),
    stakingMaturing: BigInt(defaultValue),
    stakingReleasing: BigInt(defaultValue),
    stakingReleased: BigInt(defaultValue),
    stakingMaturingTimestamp: new Date(),
    stakingReleasingTimestamp: new Date(),
    hideZeros: false,
    onRebalance: () => undefined,
};

const EEffectiveBalanceStat =
    withChakraTheme<EffectiveBalanceStatProps>(EffectiveBalanceStat);

describe('Effective Balance Stat', () => {
    // a default configured component
    const renderComponent = () =>
        render(<EEffectiveBalanceStat {...defaultProps} />);

    it('Should display effective balance label', () => {
        renderComponent();
        expect(screen.getByText('Effective Balance')).toBeInTheDocument();
    });

    it('Should not display rebalance icon', () => {
        render(
            <EEffectiveBalanceStat
                {...defaultProps}
                stake={0n}
                unstake={0n}
                withdraw={0n}
            />,
        );

        expect(() => screen.getByRole('rebalance-icon')).toThrow(
            'Unable to find an accessible element with the role "rebalance-icon"',
        );
    });

    it('Should not display location icon', () => {
        renderComponent();
        expect(screen.getByTestId('rebalance-icon')).toBeInTheDocument();
    });

    it('Should display required text for balance tooltip', async () => {
        renderComponent();
        const text = 'Amount of mature pool tokens at the Staking contract';

        const icon = screen.getByTestId('balance-icon');
        await act(() => {
            userEvent.hover(icon);
        });

        await screen.findByText(text);
        expect(screen.getByText(text)).toBeVisible();
    });
});
