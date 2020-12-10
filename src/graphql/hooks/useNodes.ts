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
    const [searchKey, setSearchKey] = useState<string>('');
    const [pageNumber, setPageNumber] = useState<number>(0);

    const { loading, error, data } = useQuery<NodesData, NodesVars>(NODES, {
        variables: {
            first: nodesPerPage,
            where: searchKey
                ? {
                      id: searchKey,
                  }
                : {},
            skip: pageNumber * nodesPerPage,
            orderBy: 'timestamp',
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
        pollInterval: 60 * 60 * 1000, // Refresh every 1 hour
    });

    const updateSearchKey = (newSearchKey: string) => {
        setSearchKey(newSearchKey);
        setPageNumber(0);
    };

    const loadNodes = (newPageNumber: number) => {
        setPageNumber(newPageNumber);
    };

    return {
        nodes: data?.nodes,
        nodesPerPage,
        pageNumber,
        searchKey,
        loading,
        error,
        loadNodes,
        updateSearchKey,
    };
};

export default useNodes;
