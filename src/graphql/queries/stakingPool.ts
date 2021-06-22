import gql from 'graphql-tag';

export const STAKINGPOOL = gql`
    query stakingPool($id: String) {
        stakingPool(id: $id) {
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

export const stakingPoolQueryVars = {
    id: '0',
};
