import gql from 'graphql-tag';

export const SUMMARY = gql`
    query summary($id: ID) {
        summary(id: $id) {
            id
            totalStakers
            totalWorkers
            totalStaked
            totalTickets
        }
    }
`;

export const summaryQueryVars = {
    id: 1,
};
