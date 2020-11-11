import gql from 'graphql-tag';

export const ALL_WORKERS = gql`
    query allWorkers(
        $first: Int
        $filter: Worker_filter
        $orderBy: Worker_orderBy
        $orderDirection: OrderDirection
    ) {
        workers(
            first: $first
            where: $filter
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

export const allWorkersQueryVars = {
    first: 10,
    filter: {
        timestamp_gt: 0,
    },
    orderBy: 'timestamp',
    orderDirection: 'desc',
};
