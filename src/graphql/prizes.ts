import gql from 'graphql-tag';

export const ALL_PRIZES = gql`
    query allPrizes($first: Int, $where: String) {
        prizes(first: $first, where: $where) {
            id
            winner
            prize
            time
        }
    }
`;

export type Prize = {
    id: String;
    winner: String;
    prize: Number;
    time: Number;
};

export const allPrizesQueryVars = {
    first: 10,
    where: {},
};
