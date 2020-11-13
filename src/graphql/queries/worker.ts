import gql from 'graphql-tag';

export const WORKERS = gql`
    query workers(
        $first: Int
        $where: Worker_filter
        $orderBy: Worker_orderBy
        $orderDirection: OrderDirection
    ) {
        workers(
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
            totalTickets
            totalReward
        }
    }
`;

export const workersQueryVars = {
    first: 10,
    where: {
        timestamp_gt: 0,
    },
    orderBy: 'timestamp',
    orderDirection: 'desc',
};
