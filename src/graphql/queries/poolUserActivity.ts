// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import gql from 'graphql-tag';

export const GET_POOL_USER_ACTIVITY = gql`
    query GetPoolUserActivity(
        $unstakeFilter: PoolUnstake_filter
        $stakeFilter: PoolStake_filter
        $depositFilter: PoolDeposit_filter
        $withdrawFilter: PoolWithdraw_filter
        $unstakeOrderBy: PoolUnstake_orderBy
        $stakeOrderBy: PoolStake_orderBy
        $depositOrderBy: PoolDeposit_orderBy
        $withdrawOrderBy: PoolWithdraw_orderBy
        $orderDirection: OrderDirection
        $first: Int
    ) {
        poolStakes(
            where: $stakeFilter
            orderBy: $stakeOrderBy
            orderDirection: $orderDirection
            first: $first
        ) {
            id
            timestamp
            amount
        }
        poolDeposits(
            where: $depositFilter
            orderBy: $depositOrderBy
            orderDirection: $orderDirection
            first: $first
        ) {
            id
            timestamp
            amount
        }

        poolUnstakes(
            where: $unstakeFilter
            orderBy: $unstakeOrderBy
            orderDirection: $orderDirection
            first: $first
        ) {
            timestamp
            amount
        }

        poolWithdraws(
            where: $withdrawFilter
            orderBy: $withdrawOrderBy
            orderDirection: $orderDirection
            first: $first
        ) {
            id
            timestamp
            amount
        }
    }
`;
