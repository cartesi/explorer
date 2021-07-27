import gql from 'graphql-tag';

export const STAKING_POOLS = gql`
    query stakingPools(
        $first: Int
        $skip: Int
        $where: StakingPool_filter
        $orderBy: StakingPool_orderBy
        $orderDirection: OrderDirection
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
`;
