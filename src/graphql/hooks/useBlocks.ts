import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { BLOCKS } from '../queries/blocks';
import { Block, BlocksData, BlocksVars } from '../models';

interface IBlocksFilter {
    id?: string;
    number?: number;
    timestamp_lt?: number;
    timestamp_gt?: number;
}

const useBlocks = (initFilter = {}) => {
    const [blocks, setBlocks] = useState<Array<Block>>([]);
    const [filter, setFilter] = useState<IBlocksFilter>(initFilter);
    const [reset, setReset] = useState<boolean>(false);

    const { loading, error, data, fetchMore } = useQuery<
        BlocksData,
        BlocksVars
    >(BLOCKS, {
        variables: {
            first: 10,
            where: filter,
            orderBy: 'timestamp',
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
    });

    const refreshBlocks = async (
        newFilter: IBlocksFilter = null,
        reset: boolean = false
    ) => {
        setFilter(newFilter ? newFilter : {});
        setReset(reset);
    };

    const updateBlocks = (rawBlocks: Array<Block>) => {
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
        refreshBlocks({
            ...filter,
            timestamp_lt: Math.ceil(new Date().getTime() / 1000), // Get last 10 blocks from now
        });
    };

    useEffect(() => {
        if (fetchMore && blocks.length) {
            const interval = setInterval(() => {
                loadNewBlocks();
            }, 300000);

            return () => clearInterval(interval);
        }
    }, [fetchMore, blocks]);

    useEffect(() => {
        if (!loading && !error && data) {
            updateBlocks(data.blocks);
        }
    }, [loading, error, data]);

    return {
        blocks,
        loading,
        error,
        filter,
        refreshBlocks,
        loadNewBlocks,
    };
};

export default useBlocks;
