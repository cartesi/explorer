import gql from 'graphql-tag';

export const STAKING_POOL = gql`
    query stakingPool($id: String) {
        stakingPool(id: $id) {
            id
            manager
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
