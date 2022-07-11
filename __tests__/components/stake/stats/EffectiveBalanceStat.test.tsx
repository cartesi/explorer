// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EffectiveBalanceStat, {
    EffectiveBalanceStatProps,
} from '../../../../src/components/stake/stats/EffectiveBalanceStat';
import { withChakraTheme } from '../../../test-utilities';
import { BigNumber } from 'ethers';

const defaultValue = '10000000000000000000000000000';
const defaultProps = {
    stake: BigNumber.from(defaultValue),
    unstake: BigNumber.from(defaultValue),
    withdraw: BigNumber.from(defaultValue),
    stakingMature: BigNumber.from(defaultValue),
    stakingMaturing: BigNumber.from(defaultValue),
    stakingReleasing: BigNumber.from(defaultValue),
    stakingReleased: BigNumber.from(defaultValue),
    stakingMaturingTimestamp: new Date(),
    stakingReleasingTimestamp: new Date(),
    hideZeros: false,
    onRebalance: () => {
        console.log('onRebalance::');
    },
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
                stake={BigNumber.from(0)}
                unstake={BigNumber.from(0)}
                withdraw={BigNumber.from(0)}
            />
        );

        expect(() => screen.getByRole('rebalance-icon')).toThrow(
            'Unable to find an accessible element with the role "rebalance-icon"'
        );
    });

    it('Should not display location icon', () => {
        renderComponent();
        expect(screen.getByRole('rebalance-icon')).toBeInTheDocument();
    });

    it('Should display balance tooltip', async () => {
        const { getByRole, getByText } = renderComponent();
        const text = 'Amount of mature pool tokens at the Staking contract';

        const icon = getByRole('balance-icon');

        fireEvent.mouseOver(icon);

        await waitFor(() => getByText(text));
        expect(getByText(text)).toBeInTheDocument();
    });
});
