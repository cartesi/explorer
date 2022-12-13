// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client';
import { NODES } from '../queries/nodes';
import { NodesData, NodesVars } from '../models';
import { constants } from 'ethers';
import { NodeStatus } from '../../services/node';

export const NODES_PER_PAGE = 10;
export const DEFAULT_SORT = 'timestamp';
const useNodes = (
    pageNumber: number,
    id: string = undefined,
    sort = 'timestamp'
) => {
    const filter = id ? { id: id.toLowerCase() } : {};
    return useQuery<NodesData, NodesVars>(NODES, {
        variables: {
            first: NODES_PER_PAGE,
            where: filter,
            skip: pageNumber * NODES_PER_PAGE,
            orderBy: sort,
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
        pollInterval: 600000, // Every 10 minutes
    });
};

type Status = Capitalize<Exclude<NodeStatus, 'none'>>;

type WhereClause = {
    status?: Status;
    status_not?: Status;
};

type Options = { where?: WhereClause };

export const useUserNodes = (
    owner: string,
    count = NODES_PER_PAGE,
    opts?: Options,
    sort = DEFAULT_SORT
) => {
    // if no owner, use address zero, so no nodes are returned
    owner = owner || constants.AddressZero;

    // convert to lowercase because backend is all lowercase
    owner = owner.toLowerCase();
    return useQuery<NodesData, NodesVars>(NODES, {
        variables: {
            first: count,
            where: { owner, ...opts?.where },
            skip: 0,
            orderBy: sort,
            orderDirection: 'desc',
        },
    });
};

export const useUserNode = (owner: string): string => {
    // if no owner, use address zero, so no nodes are returned
    owner = owner || constants.AddressZero;

    // convert to lowercase because backend is all lowercase
    owner = owner.toLowerCase();

    // get most recent node hired by user (if any)
    const nodes = useUserNodes(owner, 2);
    const existingNode =
        nodes.data?.nodes?.length > 0 &&
        nodes.data.nodes[0].id != owner &&
        nodes.data.nodes[0].id;
    return existingNode;
};

export default useNodes;
