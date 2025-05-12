// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { Table } from '@chakra-ui/react';
import UserRow from '../../../src/components/users/UserRow';
import { withChakraTheme } from '../../test-utilities';
import { formatCTSI } from '../../../src/utils/token';

const props = {
    chainId: 5,
    user: {
        id: '1',
        stakedBalance: '30000000000',
        maturingBalance: '20000000000',
        maturingTimestamp: new Date().getTime() / 1000,
        releasingBalance: '1000',
        releasingTimestamp: new Date().getTime() / 1000,
        balance: '1000000000000000000000',
        totalBlocks: 1,
        totalReward: '40000000000',
    },
};

const TableComponent = (props) => (
    <Table.Root>
        <Table.Body>
            <UserRow {...props} />
        </Table.Body>
    </Table.Root>
);

const Component = withChakraTheme(TableComponent);

describe('UserRow component', () => {
    it('should display user balance', () => {
        render(<Component {...props} />);
        expect(
            screen.getByText(`${formatCTSI(props.user.balance, 0)} CTSI`)
        ).toBeInTheDocument();
    });

    it('should display user total reward', () => {
        render(<Component {...props} />);
        expect(
            screen.getByText(`${formatCTSI(props.user.totalReward, 0)} CTSI`)
        ).toBeInTheDocument();
    });

    it('should display Private Node when user pool is not provided', () => {
        render(<Component {...props} />);
        expect(screen.getByText('Private node')).toBeInTheDocument();
    });

    it('should display stake info link when user pool is provided', () => {
        const user = {
            ...props.user,
            pool: {
                id: 1,
            },
        };
        render(<Component {...props} user={user} />);

        const stakeInfoLink = screen.getByTestId('stake-info-link');
        expect(stakeInfoLink.getAttribute('href')).toBe(`/stake/${user.id}`);
    });
});
