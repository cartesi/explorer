import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { BLOCKS } from '../queries/blocks';
import { LotteryTicket } from '../models';

const useBlocks = (initFilter = {}) => {
    const [blocks, setBlocks] = useState<Array<LotteryTicket>>([]);
    const [filter, setFilter] = useState<any>(initFilter);
    const [reset, setReset] = useState(false);

    const { loading, error, data, fetchMore } = useQuery(BLOCKS, {
        variables: {
            first: 10,
            where: filter,
            orderBy: 'timestamp',
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
    });

    const refreshBlocks = async (newFilter = null, reset = false) => {
        setFilter(newFilter ? newFilter : {});
        setReset(reset);
    };

    const updateBlocks = (rawBlocks: Array<LotteryTicket>) => {
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
            timestamp_lt: Math.ceil(new Date().getTime() / 1000), // Get last 10 tickets from now
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
            updateBlocks(data.lotteryTickets);
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
