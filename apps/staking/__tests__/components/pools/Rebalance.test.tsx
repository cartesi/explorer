// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { fireEvent, render, screen } from '@testing-library/react';
import { BigNumber } from 'ethers';
import Rebalance from '../../../src/components/pools/Rebalance';
import { formatCTSI } from '../../../src/utils/token';
import { withChakraTheme } from '../../test-utilities';

const Component = withChakraTheme(Rebalance);
const props = {
    stake: BigNumber.from('10000000000000000000'),
    unstake: BigNumber.from('10000000000000000000'),
    withdraw: BigNumber.from('10000000000000000000'),
    onRebalance: jest.fn(),
};

describe('Rebalance component', () => {
    it('should invoke onRebalance callback', () => {
        const mockedOnRebalance = jest.fn();
        render(<Component {...props} onRebalance={mockedOnRebalance} />);

        const button = screen.getByTestId('rebalance-button');
        fireEvent.click(button);

        expect(mockedOnRebalance).toHaveBeenCalled();
    });

    it('should display CTSI to stake label when stake is greater than zero', () => {
        render(<Component {...props} />);
        expect(
            screen.getByText(`${formatCTSI(props.stake)} CTSI to stake`)
        ).toBeInTheDocument();
    });

    it('should display CTSI to unstake label when unstake is greater than zero', () => {
        render(<Component {...props} />);
        expect(
            screen.getByText(`${formatCTSI(props.unstake)} CTSI to unstake`)
        ).toBeInTheDocument();
    });

    it('should display CTSI to withdraw label when unstake is greater than zero', () => {
        render(<Component {...props} />);
        expect(
            screen.getByText(`${formatCTSI(props.withdraw)} CTSI to withdraw`)
        ).toBeInTheDocument();
    });

    it('should display CTSI to withdraw label when unstake is greater than zero', () => {
        render(
            <Component
                {...props}
                stake={BigNumber.from(0)}
                unstake={BigNumber.from(0)}
                withdraw={BigNumber.from(0)}
            />
        );
        expect(screen.getByText('No need to rebalance')).toBeInTheDocument();
    });
});
