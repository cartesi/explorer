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
    ) {
        poolStakes(where: $stakeFilter) {
            id
            timestamp
            amount
            pool {
                id
            }
        }

        poolDeposits(where: $depositFilter) {
            id
            timestamp
            amount
            pool {
                id
            }
        }

        poolUnstakes(where: $unstakeFilter) {
            id
            timestamp
            amount
            pool {
                id
            }
        }

        poolWithdraws(where: $withdrawFilter) {
            id
            timestamp
            amount
            pool {
                id
            }
        }
    }
`;
