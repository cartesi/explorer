// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { render, screen } from '@testing-library/react';
import UsersTableRow, {
    UsersTableRowProps,
} from '../../../../src/components/stake/tables/UsersTableRow';
import stakingUsersData from '../../../../src/stories/stake/tables/stakingUsersData';
import { PoolBalanceWithAccumulatedShares } from '../../../../src/graphql/models';
import { Table, Tbody } from '@chakra-ui/react';
import { withChakraTheme } from '../../../test-utilities';

const [balance] =
    stakingUsersData as unknown as PoolBalanceWithAccumulatedShares[];

const defaultProps = {
    chainId: 5,
    balance,
};

const Component: FC<UsersTableRowProps> = (props) => (
    <Table>
        <Tbody>
            <UsersTableRow {...props} />
        </Tbody>
    </Table>
);

const truncateNumber = (num) => Math.trunc(num * 100) / 100;

const ThemedComponent = withChakraTheme<UsersTableRowProps>(Component);

describe('Users Table Row', () => {
    const renderComponent = (props) => render(<ThemedComponent {...props} />);

    it('should have required columns', () => {
        renderComponent(defaultProps);

        expect(screen.getByTestId('user-col')).toBeInTheDocument();
        expect(screen.getByTestId('stake-since-col')).toBeInTheDocument();
        expect(screen.getByTestId('total-staked-col')).toBeInTheDocument();
        expect(screen.getByTestId('shares-col')).toBeInTheDocument();
        expect(
            screen.getByTestId('accumulated-shared-col')
        ).toBeInTheDocument();
    });

    it('should format stake timestamp', () => {
        renderComponent(defaultProps);

        const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
            hourCycle: 'h23',
            dateStyle: 'medium',
            timeStyle: 'short',
        });

        expect(
            screen.getByText(
                dateTimeFormat.format(balance.stakeTimestamp * 1000)
            )
        ).toBeInTheDocument();
    });

    it('should format user shares', () => {
        renderComponent(defaultProps);

        expect(
            screen.getAllByText(`${balance.sharesPercent}%`).length > 0
        ).toBe(true);
    });

    it('should format accumulated shares', () => {
        renderComponent(defaultProps);

        expect(
            screen.getAllByText(
                `${truncateNumber(balance.accumulatedSharesPercent)}%`
            ).length > 0
        ).toBe(true);
    });
});
