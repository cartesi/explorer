// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { FaNetworkWired } from 'react-icons/fa';
import PoolCommission from '../../../src/components/pools/PoolCommission';
import { StakingPool } from '../../../src/graphql/models';
import stakingPoolsData from '../../../src/stories/stake/tables/stakingPoolsData';
import { withChakraTheme } from '../../test-utilities';

const [pool] = stakingPoolsData as unknown as StakingPool[];

const Component = withChakraTheme(PoolCommission);
const props = {
    pool,
    label: 'Some label',
};

const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
});

describe('PoolCommission component', () => {
    it('should display correct label', () => {
        render(<Component {...props} />);
        expect(screen.getByText(props.label)).toBeInTheDocument();
    });

    it('should display correct value label', () => {
        render(<Component {...props} />);
        const { pool } = props;

        const accruedCommissionLabel =
            pool.commissionPercentage !== null
                ? numberFormat.format(pool.commissionPercentage)
                : '-';
        const commissionLabel = `${(pool.fee.commission / 100).toFixed(2)} %`;

        const valueLabel = `${accruedCommissionLabel} (${commissionLabel})`;

        expect(screen.getByText(valueLabel)).toBeInTheDocument();
    });

    it('should display icon', () => {
        render(<Component {...props} icon={FaNetworkWired} />);
        expect(screen.getByTestId('pool-commission-icon')).toBeInTheDocument();
    });

    it('should not display icon', () => {
        render(<Component {...props} />);
        expect(() => screen.getByTestId('pool-commission-icon')).toThrow(
            'Unable to find an element'
        );
    });
});
