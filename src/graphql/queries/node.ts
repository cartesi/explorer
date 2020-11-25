import gql from 'graphql-tag';

export const NODES = gql`
    query nodes(
        $first: Int
        $where: Node_filter
        $orderBy: Node_orderBy
        $orderDirection: OrderDirection
    ) {
        nodes(
            first: $first
            where: $where
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            id
            owner {
                id
                stakedBalance
            }
            timestamp
            status
            totalBlocks
            totalReward
        }
    }
`;

export const nodesQueryVars = {
    first: 10,
    where: {},
    orderBy: 'timestamp',
    orderDirection: 'desc',
};
