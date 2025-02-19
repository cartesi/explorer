// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import gql from 'graphql-tag';

export const GET_POOL_ACTIVITIES = gql`
    query GetPoolActivities(
        $where: PoolActivity_filter
        $orderBy: PoolActivity_orderBy
        $orderDirection: OrderDirection
        $first: Int
    ) {
        poolActivities(
            where: $where
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            id
            user {
                id
            }
            type
            amount
            timestamp
        }
    }
`;
