// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import gql from 'graphql-tag';

export const USER = gql`
    query user($id: String) {
        user(id: $id) {
            id
            stakedBalance
            maturingBalance
            maturingTimestamp
            releasingBalance
            releasingTimestamp
            balance
            totalBlocks
            totalReward
        }
    }
`;

export const IS_CARTESI_USER_QUERY = gql`
    query user($id: ID!) {
        user(id: $id) {
            id
        }

        poolUser(id: $id) {
            id
        }

        node(id: $id) {
            id
        }
    }
`;

export interface IsCartesiUserQuery {
    user: { id: string } | null;
    poolUser: { id: string } | null;
    node: { id: string } | null;
}

export const userQueryVars = {
    id: '0',
};
