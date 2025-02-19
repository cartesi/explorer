// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client';
import { BLOCKS } from '../queries';
import { BlocksData, BlocksVars, BlocksWhere } from '../models';

const useBlocks = (where: BlocksWhere = {}, count = 100) => {
    // normalize to lowercase, because the graph is all lowercase
    where.node = where.node ? where.node.toLowerCase() : undefined;
    where.producer = where.producer ? where.producer.toLowerCase() : undefined;

    const variables: BlocksVars = {
        where,
        count,
        skip: 0,
    };

    return useQuery<BlocksData, BlocksVars>(BLOCKS, {
        variables,
        notifyOnNetworkStatusChange: true,
    });
};

export default useBlocks;
