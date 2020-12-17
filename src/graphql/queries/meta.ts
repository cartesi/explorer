import gql from 'graphql-tag';

export const META = gql`
    query _meta {
        _meta {
            block {
                hash
                number
            }

            deployment
            hasIndexingErrors
        }
    }
`;
