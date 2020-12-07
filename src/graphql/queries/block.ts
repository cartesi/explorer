import gql from 'graphql-tag';

export const BLOCK = gql`
    query block($id: String) {
        block(id: $id) {
            id

            number
            timestamp
            reward
            difficulty

            chain {
                id
            }

            producer {
                id
                totalBlocks
            }

            node {
                id
            }
        }
    }
`;

export const blockQueryVars = {
    id: '0',
};
