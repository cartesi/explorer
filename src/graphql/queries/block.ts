import gql from 'graphql-tag';

export const BLOCK = gql`
    query lotteryTicket($id: String) {
        lotteryTicket(id: $id) {
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

export const blockQueryVars = {
    id: '0',
};
