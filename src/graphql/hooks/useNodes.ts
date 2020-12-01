import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { NODES } from '../queries/node';
import { Node, NodesData, NodesVars } from '../models';

interface INodeFilter {
    timestamp_gt?: number;
    timestamp_lt?: number;
}

const useNodes = () => {
    const [nodes, setNodes] = useState<Array<Node>>([]);

    const [lastTimestamp, setLastTimestamp] = useState<number>(0);
    const [firstTimestamp, setFirstTimestamp] = useState<number>(0);

    const [where, setWhere] = useState<INodeFilter>({});

    const { loading, error, data, fetchMore } = useQuery<NodesData, NodesVars>(
        NODES,
        {
            variables: {
                first: 10,
                where,
                orderBy: 'timestamp',
                orderDirection: 'desc',
            },
            notifyOnNetworkStatusChange: true,
        }
    );

    const refreshNodes = async (
        pageOffset: number = 0,
        newId: string = null
    ) => {
        let newWhere: any =
            pageOffset === -2
                ? {
                      timestamp_gt: 0,
                  }
                : pageOffset === 1
                ? {
                      timestamp_lt: lastTimestamp,
                  }
                : {
                      timestamp_gt: firstTimestamp,
                  };

        if (newId && newId != '') {
            newWhere = {
                ...newWhere,
                id: newId,
            };
        }

        setWhere(newWhere);
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

    useEffect(() => {
        if (nodes.length > 0) {
            setFirstTimestamp(nodes[0].timestamp);
            setLastTimestamp(nodes[nodes.length - 1].timestamp);
        }
    }, [nodes]);

    return {
        nodes,
        refreshNodes,
    };
};

export default useNodes;
