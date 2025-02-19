// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import gql from 'graphql-tag';

export const SUMMARY = gql`
    query summary($id: ID) {
        summary(id: $id) {
            id
            totalUsers
            totalPools
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
