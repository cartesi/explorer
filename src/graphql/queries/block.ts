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
                number

                protocol {
                    version
                }
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
