import gql from 'graphql-tag';

export const STAKINGPOOLS = gql`
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
            totalUsers
            totalCommission
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

export const stakingPoolsQueryVars = {
    first: 10,
    where: {},
    orderBy: 'totalUsers',
    orderDirection: 'desc',
};
