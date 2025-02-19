// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import UsersChart from '../../../src/components/stake/UsersChart';
import { withChakraTheme } from '../../test-utilities';
import stakingPoolUserHistories from '../../../src/stories/stake/stakingPoolUserHistories';
import { StakingPoolUserHistory } from '../../../src/graphql/models';
import { DateTime } from 'luxon';

const defaultProps = {
    data: stakingPoolUserHistories as unknown as StakingPoolUserHistory[],
    month: DateTime.fromJSDate(new Date()),
    totalUsers: 100,
    loading: false,
};

const Component = withChakraTheme(UsersChart);

describe('Users Chart', () => {
    // a default configured component
    const renderComponent = (props) => render(<Component {...props} />);

    it('should display loading', () => {
        renderComponent({
            ...defaultProps,
            loading: true,
        });

        expect(screen.getAllByText('Loading...').length > 0).toBe(true);
    });

    it('should display no users', () => {
        renderComponent({
            ...defaultProps,
            totalUsers: 0,
            data: [],
        });

        expect(screen.getByText('No users')).toBeInTheDocument();
    });

    it('should display users chart', () => {
        renderComponent(defaultProps);

        expect(screen.getByTestId('users-chart')).toBeInTheDocument();
    });
});
