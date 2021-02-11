import gql from 'graphql-tag';

export const SUMMARY = gql`
    query summary($id: ID) {
        summary(id: $id) {
            id
            totalUsers
            totalStakers
            totalNodes
            totalStaked
            totalBlocks
            totalReward
            totalChains
        }
    }
`;

export const summaryQueryVars = {
    id: 1,
};
