// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { render, screen } from '@testing-library/react';
import PoolCommissionsTable, {
    PoolCommissionsTableProps,
} from '../../../../src/components/stake/tables/PoolCommissionsTable';
import commissionsData from '../../../../src/stories/stake/tables/commissionsData';
import { withChakraTheme } from '../../../test-utilities';
import {
    StakingPoolFlat,
    StakingPoolSortExtended,
} from '../../../../src/graphql/models';

jest.mock('@chakra-ui/react', () => {
    const originalModule = jest.requireActual('@chakra-ui/react');
    return {
        __esModule: true,
        ...originalModule,
        useBreakpointValue: () => 'Stake/Info',
    };
});

const defaultProps = {
    account: '0x07b41c2b437e69dd1523bf1cff5de63ad9bb3dc6',
    chainId: 5,
    loading: false,
    sort: 'commissionPercentage' as StakingPoolSortExtended,
    data: commissionsData as unknown as StakingPoolFlat[],
    onSort: () => undefined,
};

const Component =
    withChakraTheme<PoolCommissionsTableProps>(PoolCommissionsTable);

describe('Pool Commissions Table', () => {
    const renderComponent = (props) => render(<Component {...props} />);

    it('Should have required columns', () => {
        renderComponent(defaultProps);
        expect(screen.getByText('Date')).toBeInTheDocument();
        expect(screen.getByText('Commission')).toBeInTheDocument();
        expect(screen.getByText('Change')).toBeInTheDocument();
    });

    it('should display loading', () => {
        renderComponent({
            ...defaultProps,
            loading: true,
        });

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should display no items', () => {
        renderComponent({
            ...defaultProps,
            data: [],
        });

        expect(screen.getByText('No items')).toBeInTheDocument();
    });

    it('should display some items', () => {
        renderComponent({
            ...defaultProps,
        });

        const rows = screen.getAllByTestId('pool-commissions-table-row');

        expect(rows?.length).toBe(commissionsData.length);
    });
});
