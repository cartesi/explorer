// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import UserTable from '../../../src/components/users/UserTable';
import { withChakraTheme } from '../../test-utilities';

const Component = withChakraTheme(UserTable);
const props = {
    chainId: 5,
    loading: false,
    data: [
        {
            id: '1',
            stakedBalance: '1000',
            maturingBalance: '1000',
            maturingTimestamp: new Date().getTime() / 1000,
            releasingBalance: '1000',
            releasingTimestamp: new Date().getTime() / 1000,
            balance: '1000',
            totalBlocks: 1,
            totalReward: '1000',
        },
    ],
    onSort: jest.fn(),
};

describe('UserTable component', () => {
    it('should display Block Produced column', () => {
        render(<Component {...props} />);
        expect(screen.getByText('Block Produced')).toBeInTheDocument();
    });

    it('should display Total Staked column', () => {
        render(<Component {...props} />);
        expect(screen.getByText('Total Staked')).toBeInTheDocument();
    });

    it('should display Total Rewards column', () => {
        render(<Component {...props} />);
        expect(screen.getByText('Block Produced')).toBeInTheDocument();
    });

    it('should display loading state', () => {
        render(<Component {...props} loading />);
        expect(screen.getAllByText('Loading...').length).toBe(2);
    });

    it('should display empty state', () => {
        render(<Component {...props} data={[]} />);
        expect(screen.getByText('No items')).toBeInTheDocument();
    });

    it('should display user rows', () => {
        render(<Component {...props} />);

        expect(screen.getAllByTestId('user-row').length).toBe(
            props.data.length
        );
    });
});
