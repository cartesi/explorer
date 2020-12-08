import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { NODES } from '../queries/node';
import { Node, NodesData, NodesVars } from '../models';

interface INodeFilter {
    id?: string;
    timestamp_gt?: number;
    timestamp_lt?: number;
    owner?: string;
}

const useNodes = (initFilter: INodeFilter = {}) => {
    const [nodes, setNodes] = useState<Array<Node>>([]);

    const [where, setWhere] = useState<INodeFilter>(initFilter);

    const { loading, error, data } = useQuery<NodesData, NodesVars>(NODES, {
        variables: {
            first: 10,
            where,
            orderBy: 'timestamp',
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
    });

    const refreshNodes = async (newFilter: INodeFilter) => {
        if (newFilter.id) {
            newFilter = {
                ...newFilter,
                id: newFilter.id.toLowerCase(),
            };
        }

        setWhere(newFilter);
    };

    useEffect(() => {
        if (!loading && !error && data) {
            const newNodes = data.nodes.map((node) => {
                return {
                    ...node,
                    key: node.id,
                };
            });

            setNodes(newNodes.sort((a, b) => b.timestamp - a.timestamp));
        }
    }, [loading, error, data]);

    return {
        nodes,
        refreshNodes,
    };
};

export default useNodes;
