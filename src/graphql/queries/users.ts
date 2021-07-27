// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import gql from 'graphql-tag';

export const USERS = gql`
    query users(
        $first: Int
        $skip: Int
        $where: User_filter
        $orderBy: User_orderBy
        $orderDirection: OrderDirection
    ) {
        users(
            first: $first
            skip: $skip
            where: $where
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            id
            stakedBalance
            totalBlocks
            totalReward
            pool {
                manager
            }
        }
    }
`;

export const usersQueryVars = {
    first: 10,
    where: {},
    orderBy: 'stakedBalance',
    orderDirection: 'desc',
};
