import gql from 'graphql-tag';

export const ALL_LOTTERY_TICKETS = gql`
    query allLotteryTickets($first: Int, $lastTime: Int) {
        lotteryTickets(first: $first, where: { time_gt: $lastTime }) {
            id
            count
            _winner
            _roundCount
            txHash
        }
    }
`;

export type LotteryTicket = {
    id: string;
    count: string;
    _winner: string;
    _roundCount: string;
    txHash: string;
};

export const allLotteryTicketsQueryVars = {
    first: 10,
    lastTime: 0,
};
