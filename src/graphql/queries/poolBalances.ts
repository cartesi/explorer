// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import gql from 'graphql-tag';

export const POOL_BALANCES = gql`
    query poolBalances(
        $first: Int
        $skip: Int
        $where: PoolBalance_filter
        $orderBy: PoolBalance_orderBy
        $orderDirection: OrderDirection
    ) {
        poolBalances(
            first: $first
            skip: $skip
            where: $where
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            id
            user {
                id
            }

            shares
            balance
            stakeTimestamp

            pool {
                id
                manager
                amount
                shares
                totalUsers
                totalCommission
                commissionPercentage
                paused
                timestamp

                fee {
                    id
                    commission
                    gas
                    created
                    lastUpdated
                }

                user {
                    id
                    stakedBalance
                    totalBlocks
                    totalReward
                }
            }
        }
    }
`;
