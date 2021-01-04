import gql from 'graphql-tag';

export const USERS = gql`
    query users(
        $first: Int
        $skip: Int
        $where: User_filter
        $orderBy: User_orderBy
        $orderDirection: OrderDirection
    ) {
        users(
            first: $first
            skip: $skip
            where: $where
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            id
            stakedBalance
            totalBlocks
            totalReward
        }
    }
`;

export const usersQueryVars = {
    first: 10,
    where: {},
    orderBy: 'stakedBalance',
    orderDirection: 'desc',
};
