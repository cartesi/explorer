// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import gql from 'graphql-tag';

export const STAKING_POOLS_EXTENDED = gql`
    query stakingPools(
        $first: Int
        $skip: Int
        $where: StakingPoolCondition
        $orderBy: [StakingPoolsOrderBy!]
    ) {
        allStakingPools(
            first: $first
            offset: $skip
            condition: $where
            orderBy: $orderBy
        ) {
            nodes {
                id
                manager
                amount
                shares
                totalUsers
                totalCommission
                commissionPercentage
                paused
                timestamp
                feeId
                feeCommission
                feeGas
                feeCreated
                feeLastUpdated
                userStakedBalance
                userMaturingBalance
                userMaturingTimestamp
                userReleasingBalance
                userReleasingTimestamp
                userBalance
                userTotalBlocks
                userTotalReward
                shareValue
                weekShareValue
                weekShareTimestamp
                monthShareValue
                monthShareTimestamp
                weekPerformance
                monthPerformance
            }
        }
    }
`;
