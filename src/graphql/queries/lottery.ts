import gql from 'graphql-tag';

export const ALL_LOTTERY_TICKETS = gql`
    query allLotteryTickets(
        $first: Int
        $filter: LotteryTicket_filter
        $orderBy: LotteryTicket_orderBy
        $orderDirection: OrderDirection
    ) {
        lotteryTickets(
            first: $first
            where: $filter
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            id
            round
            winner
            worker {
                id
            }

            difficulty
            timestamp

            user {
                id
            }
            userPrize
            beneficiary
            beneficiaryPrize
        }
    }
`;

export const allLotteryTicketsQueryVars = {
    first: 10,
    filter: {
        timestamp_gt: 0,
    },
    orderBy: 'timestamp',
    orderDirection: 'desc',
};
