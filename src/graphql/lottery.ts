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
            winner
            roundCount
            difficulty

            winners {
                id
                winner
                prize
                time
            }
        }
    }
`;

export type LotteryTicket = {
    id: string;
    winner: string;
    roundCount: number;
    difficulty: number;

    winners: Array<LotteryWinner>;
};

export type LotteryWinner = {
    id: string;
    winner: string;
    prize: number;
    time: number;
};

export const allLotteryTicketsQueryVars = {
    first: 10,
    filter: {
        roundCount_gt: 0,
    },
    orderBy: 'roundCount',
    orderDirection: 'desc',
};
