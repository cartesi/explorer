// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import UsersTable, {
    UsersTableProps,
} from '../../../../src/components/stake/tables/UsersTable';
import stakingUsersData from '../../../../src/stories/stake/tables/stakingUsersData';
import { withChakraTheme } from '../../../test-utilities';
import { PoolBalanceWithAccumulatedShares } from '../../../../src/graphql/models';

const defaultProps = {
    chainId: 5,
    loading: false,
    data: stakingUsersData as unknown as PoolBalanceWithAccumulatedShares[],
};

const Component = withChakraTheme<UsersTableProps>(UsersTable);

describe('Users Table', () => {
    const renderComponent = (props) => render(<Component {...props} />);

    it('should have required columns', () => {
        renderComponent(defaultProps);
        expect(screen.getByText('User')).toBeInTheDocument();
        expect(screen.getByText('Stake Since')).toBeInTheDocument();
        expect(screen.getByText('Total Staked')).toBeInTheDocument();
        expect(screen.getByText('Shares')).toBeInTheDocument();
        expect(screen.getByText('Accumulated Shares')).toBeInTheDocument();
    });

    it('should display loading', () => {
        renderComponent({
            ...defaultProps,
            loading: true,
        });

        expect(screen.getAllByText('Loading...').length > 0).toBe(true);
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

        const rows = screen.getAllByTestId('users-table-row');

        expect(rows?.length).toBe(stakingUsersData.length);
    });
});
