import gql from 'graphql-tag';

export const BLOCKS = gql`
    query lotteryTickets(
        $first: Int
        $where: LotteryTicket_filter
        $orderBy: LotteryTicket_orderBy
        $orderDirection: OrderDirection
    ) {
        lotteryTickets(
            first: $first
            where: $where
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

export const blocksQueryVars = {
    first: 10,
    where: {},
    orderBy: 'timestamp',
    orderDirection: 'desc',
};
