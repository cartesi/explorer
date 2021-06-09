import gql from 'graphql-tag';

export const STAKINGPOOL = gql`
    query stakingPool($id: String) {
        stakingPool(id: $id) {
            id
            manager
            commission
            gas
            totalUsers
            totalCommission
            timestamp

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
