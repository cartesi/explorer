import gql from 'graphql-tag';

export const ALL_LOTTERY_WINNERS = gql`
    query allLotteryWinners($first: Int, $lastTime: Int) {
        lotteryWinners(first: $first, where: { time_gt: $lastTime }) {
            id
            winner
            prize
            time
            txHash
        }
    }
`;

export type LotteryWinner = {
    id: string;
    winner: string;
    prize: string;
    time: string;
    txHash: string;
};

export const allLotteryWinnersQueryVars = {
    first: 10,
    lastTime: 0,
};
