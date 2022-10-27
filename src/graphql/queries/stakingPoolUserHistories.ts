// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import gql from 'graphql-tag';

export const STAKING_POOL_USER_HISTORIES = gql`
    query stakingPoolUserHistories(
        $first: Int
        $skip: Int
        $where: StakingPoolUserHistory_filter
        $orderBy: StakingPoolUserHistory_orderBy
        $orderDirection: OrderDirection
    ) {
        stakingPoolUserHistories(
            first: $first
            skip: $skip
            where: $where
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            id
            action
            pool {
                id
            }
            user {
                id
            }
            timestamp
            totalUsers
        }
    }
`;
