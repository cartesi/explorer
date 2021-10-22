// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import gql from 'graphql-tag';

export const NODES = gql`
    query nodes(
        $first: Int
        $skip: Int
        $where: Node_filter
        $orderBy: Node_orderBy
        $orderDirection: OrderDirection
    ) {
        nodes(
            first: $first
            skip: $skip
            where: $where
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            id
            owner {
                id
                stakedBalance
                maturingBalance
                maturingTimestamp
                releasingBalance
                releasingTimestamp
                balance
            }
            timestamp
            status
            totalBlocks
            totalReward
        }
    }
`;

export const nodesQueryVars = {
    first: 10,
    where: {},
    orderBy: 'timestamp',
    orderDirection: 'desc',
};
