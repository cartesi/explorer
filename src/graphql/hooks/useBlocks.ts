import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { apolloClient } from '../../services/apollo';
import { BLOCKS } from '../queries/blocks';
import { Block, BlocksData, BlocksVars } from '../models';

interface IBlocksFilter {
    id?: string;
    number?: number;
    producer?: string;
    node?: string;
    timestamp_lt?: number;
    timestamp_gt?: number;
}

const useBlocks = (initFilter = {}) => {
    const [blocks, setBlocks] = useState<Array<Block>>([]);
    const [filters, setFilters] = useState<Array<IBlocksFilter>>([initFilter]);
    const [reset, setReset] = useState<boolean>(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refreshBlocks = async (
        newFilters: Array<IBlocksFilter> = null,
        reset: boolean = false
    ) => {
        setFilters(newFilters ? newFilters : [{}]);
        setReset(reset);
    };

    const updateBlocks = (rawBlocks: Array<Block>, reset: boolean = false) => {
        if (!rawBlocks) return;

        let newBlocks = rawBlocks.map((block) => ({
            ...block,
            key: block.id,
        }));

        if (!reset) {
            newBlocks = _.unionBy(blocks, newBlocks, 'key');
        }

        setBlocks(newBlocks.sort((a, b) => b.timestamp - a.timestamp));
    };

    const loadNewBlocks = () => {
        refreshBlocks(
            filters.map((filter) => ({
                ...filter,
                timestamp_lt: Math.ceil(new Date().getTime() / 1000), // Get last 10 blocks from now
            }))
        );
    };

    useEffect(() => {
        setLoading(true);
        setError(null);

        const variables = {
            first: 10,
            where: null,
            orderBy: 'timestamp',
            orderDirection: 'desc',
        };

        const queryResults = filters.map((filter) => {
            return apolloClient.query<BlocksData, BlocksVars>({
                query: BLOCKS,
                variables: {
                    ...variables,
                    where: filter,
                },
            });
        });

        Promise.all(queryResults)
            .then((results) => {
                let blocks = [];
                for (let i = 0; i < results.length; i++) {
                    blocks = _.unionBy(
                        blocks,
                        results[i].data ? results[i].data.blocks : [],
                        'id'
                    );
                }
                updateBlocks(blocks, reset);

                setLoading(false);
                setError(
                    results.reduce((prev, cur) => prev || cur.error, null)
                );
            })
            .catch((error) => {
                console.error(error);
            });
    }, [filters]);

    useEffect(() => {
        const interval = setInterval(() => {
            loadNewBlocks();
        }, 300000);

        return () => clearInterval(interval);
    }, []);

    return {
        blocks,
        loading,
        error,
        filters,
        refreshBlocks,
        loadNewBlocks,
    };
};

export default useBlocks;
