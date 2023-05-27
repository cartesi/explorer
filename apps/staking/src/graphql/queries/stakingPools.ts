// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import gql from 'graphql-tag';

export const STAKING_POOLS = gql`
    query stakingPools(
        $first: Int
        $skip: Int
        $firstWeeklyPerf: Int
        $firstMonthlyPerf: Int
        $where: StakingPool_filter
        $orderBy: StakingPool_orderBy
        $monthlyOrderBy: MonthlyPoolPerformance_orderBy
        $weeklyOrderBy: WeeklyPoolPerformance_orderBy
        $orderDirection: OrderDirection
        $weeklyOrderDirection: OrderDirection
        $monthlyOrderDirection: OrderDirection
        $whereWeekly: WeeklyPoolPerformance_filter
        $whereMonthly: MonthlyPoolPerformance_filter
    ) {
        stakingPools(
            first: $first
            skip: $skip
            where: $where
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
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
                maturingBalance
                maturingTimestamp
                releasingBalance
                releasingTimestamp
                balance
                totalBlocks
                totalReward
            }
            monthlyPerformance(
                first: $firstMonthlyPerf
                orderDirection: $monthlyOrderDirection
                orderBy: $monthlyOrderBy
                where: $whereMonthly
            ) {
                id
                performance
                timestamp
            }
            weeklyPerformance(
                first: $firstWeeklyPerf
                orderDirection: $weeklyOrderDirection
                orderBy: $weeklyOrderBy
                where: $whereWeekly
            ) {
                id
                performance
                timestamp
            }
        }
    }
`;

export const STAKING_POOLS_IDS = gql`
    query getPools($where: StakingPool_filter) {
        stakingPools(where: $where) {
            id
        }
    }
`;
