import gql from 'graphql-tag';

export const ALL_PRIZES = gql`
    query allPrizes($first: Int, $lastTime: Int) {
        prizes(first: $first, where: { time_gt: $lastTime }) {
            id
            winner
            prize
            time
        }
    }
`;

export type Prize = {
    id: string;
    winner: string;
    prize: string;
    time: string;
};

export const allPrizesQueryVars = {
    first: 10,
    lastTime: 0,
};
