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
            worker

            difficulty
            time

            user
            userPrize
            beneficiary
            beneficiaryPrize
        }
    }
`;

export type LotteryTicket = {
    id: string;
    round: number;
    winner: string;
    worker: string;

    difficulty: number;
    time: number;

    user: string;
    userPrize: number;
    beneficiary: string;
    beneficiaryPrize: string;
};

export const allLotteryTicketsQueryVars = {
    first: 10,
    filter: {
        round_gt: 0,
    },
    orderBy: 'round',
    orderDirection: 'desc',
};
