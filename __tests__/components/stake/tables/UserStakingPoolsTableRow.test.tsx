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
import { Table, Tbody } from '@chakra-ui/react';
import UserStakingPoolsTableRow, {
    UserStakingPoolsTableRowProps,
} from '../../../../src/components/stake/tables/UserStakingPoolsTableRow';
import userStakingPoolsData from '../../../../src/stories/stake/tables/userStakingPoolsData';
import { PoolBalance } from '../../../../src/graphql/models';
import { withChakraTheme } from '../../../test-utilities';

jest.mock('next/link', () => ({ children, ...restProps }) => (
    <div {...restProps}>{children}</div>
));

const [balance] = userStakingPoolsData as unknown as PoolBalance[];

const defaultProps = {
    account: '0x07b41c2b437e69dd1523bf1cff5de63ad9bb3dc6',
    chainId: 5,
    balance,
};

const Component: FC<UserStakingPoolsTableRowProps> = (props) => (
    <Table>
        <Tbody>
            <UserStakingPoolsTableRow {...props} />
        </Tbody>
    </Table>
);

const ThemedComponent =
    withChakraTheme<UserStakingPoolsTableRowProps>(Component);

describe('User Staking Pools Table Row', () => {
    const renderComponent = (props) => render(<ThemedComponent {...props} />);

    it('Should have required columns', () => {
        renderComponent(defaultProps);

        expect(screen.getByTestId('address-col')).toBeInTheDocument();
        expect(screen.getByTestId('unstaked-col')).toBeInTheDocument();
        expect(screen.getByTestId('staked-col')).toBeInTheDocument();
        expect(screen.getByTestId('percentage-col')).toBeInTheDocument();
        expect(screen.getByTestId('stake-info-col')).toBeInTheDocument();
    });

    it('should have href to stake info page', () => {
        renderComponent(defaultProps);

        const stakeInfoLink =
            screen.getByTestId('stake-info-link').parentElement;
        expect(stakeInfoLink.getAttribute('href')).toBe(
            `/stake/${balance.pool.id}`
        );
    });
});
