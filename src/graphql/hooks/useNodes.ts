import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { NODES } from '../queries/nodes';
import { NodesData, NodesVars } from '../models';

interface INodeFilter {
    id?: string;
    timestamp_gt?: number;
    timestamp_lt?: number;
    owner?: string;
}

const nodesPerPage = 10;

const useNodes = () => {
    const [filter, setFilter] = useState<INodeFilter>({});
    const [pageNumber, setPageNumber] = useState<number>(0);

    const { loading, error, data } = useQuery<NodesData, NodesVars>(NODES, {
        variables: {
            first: nodesPerPage,
            where: filter,
            skip: pageNumber * nodesPerPage,
            orderBy: 'timestamp',
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
        pollInterval: 600000, // Refresh every 1 hour
    });

    const updateFilter = (newFilter: INodeFilter) => {
        setFilter(newFilter);
        setPageNumber(0);
    };

    const loadNodes = (newPageNumber: number) => {
        setPageNumber(newPageNumber);
    };

    return {
        nodes: data?.nodes,
        nodesPerPage,
        pageNumber,
        filter,
        loading,
        error,
        loadNodes,
        updateFilter,
    };
};

export default useNodes;
