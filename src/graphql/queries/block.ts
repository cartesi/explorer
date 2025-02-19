// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import gql from 'graphql-tag';

export const BLOCK = gql`
    query block($id: String) {
        block(id: $id) {
            id

            number
            timestamp
            reward
            commission
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
