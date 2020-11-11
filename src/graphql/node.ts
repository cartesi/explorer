import gql from 'graphql-tag';

export const ALL_WORKERS = gql`
    query allWorkers(
        $first: Int
        $filter: LotteryTicket_filter
        $orderBy: LotteryTicket_orderBy
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

export const allLotteryTicketsQueryVars = {
    first: 10,
    filter: {
        round_gt: 0,
    },
    orderBy: 'round',
    orderDirection: 'desc',
};
