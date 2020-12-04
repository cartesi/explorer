import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { apolloClient } from '../../services/apollo';
import { BLOCKS } from '../queries/blocks';
import { Block, BlocksData, BlocksVars } from '../models';
import { BigNumber, constants, FixedNumber } from 'ethers';

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

        let newBlocks = rawBlocks;

        if (!reset) {
            newBlocks = _.unionBy(blocks, newBlocks, 'id');
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

    const getRewardRate = (rawCirculatingSupply: number) => {
        let participationRate = FixedNumber.from(0);
        let yearReturn = FixedNumber.from(0);

        if (blocks && blocks.length > 0 && rawCirculatingSupply) {
            const blocksPerChain = _.groupBy(blocks, 'chain.id');

            const yearSeconds = constants.One.mul(60) // minute
                .mul(60) // hour
                .mul(24) // day
                .mul(365); // year

            const ratesPerChain = Object.keys(blocksPerChain).map((chainId) => {
                const blocks: Array<Block> = blocksPerChain[chainId];

                // take average difficulty of all blocks in array
                const difficulty = blocks
                    .map((t) => BigNumber.from(t.difficulty))
                    .reduce((sum, d) => sum.add(d), constants.Zero)
                    .div(blocks.length);

                const targetInterval = blocks[0].chain.targetInterval;

                // calculate estimated active stake from difficulty
                const activeStake = difficulty.div(targetInterval);

                // convert circulation supply to BigNumber and multiple by 1e18
                const circulationSupply = BigNumber.from(
                    rawCirculatingSupply
                ).mul(constants.WeiPerEther);

                // participation rate is a percentage of circulation supply
                // must use FixedNumber because BigNumber is only for integer
                const participationRate = FixedNumber.fromValue(
                    activeStake
                ).divUnsafe(FixedNumber.fromValue(circulationSupply));

                // calculate average prize
                const reward = blocks
                    .map((block) => BigNumber.from(block.reward))
                    .reduce((sum, prize) => sum.add(prize), constants.Zero)
                    .div(blocks.length);

                // total prize paid in one year
                const yearPrize = yearSeconds.div(targetInterval).mul(reward);

                // calculate year return
                const yearReturn = FixedNumber.fromValue(yearPrize).divUnsafe(
                    FixedNumber.fromValue(activeStake)
                );

                return {
                    participationRate,
                    yearReturn,
                };
            });

            // Average participation rate
            participationRate = ratesPerChain
                .reduce(
                    (prev, cur) => prev.addUnsafe(cur.participationRate),
                    FixedNumber.from(0)
                )
                .divUnsafe(FixedNumber.from(ratesPerChain.length));

            // Sum up yearReturn
            yearReturn = ratesPerChain.reduce(
                (prev, cur) => prev.addUnsafe(cur.yearReturn),
                FixedNumber.from(0)
            );
        }

        return {
            participationRate,
            yearReturn,
        };
    };

    const getEstimatedRewardRate = (
        stake: BigNumber,
        totalStaked: number,
        period: number
    ) => {
        let reward = constants.Zero;
        let apr = FixedNumber.from(0);
        let activeStake = constants.Zero;

        if (blocks && blocks.length > 0) {
            const blocksPerChain = _.groupBy(blocks, 'chain.id');

            const ratesPerChain = Object.keys(blocksPerChain).map((chainId) => {
                const blocks: Array<Block> = blocksPerChain[chainId];
                const avgPrize = blocks
                    .reduce(
                        (prev, cur) => prev.add(BigNumber.from(cur.reward)),
                        constants.Zero
                    )
                    .div(BigNumber.from(blocks.length));

                // take average difficulty of all blocks in array
                const difficulty = blocks
                    .map((t) => BigNumber.from(t.difficulty))
                    .reduce((sum, d) => sum.add(d), constants.Zero)
                    .div(blocks.length);

                const targetInterval = blocks[0].chain.targetInterval;

                const activeStake = difficulty.div(targetInterval);

                // user stake share
                const stakePercentage = FixedNumber.fromValue(stake).divUnsafe(
                    FixedNumber.fromValue(
                        constants.One.mul(totalStaked)
                            .mul(constants.WeiPerEther)
                            .add(stake)
                    )
                );

                // investment period in seconds
                const periodSeconds = BigNumber.from(period)
                    .mul(24)
                    .mul(60)
                    .mul(60);

                // number of block drawn in that period
                const totalBlocks = periodSeconds.div(targetInterval);

                // number of block claimed by the user (statistically)
                const blocksClaimed = stakePercentage.mulUnsafe(
                    FixedNumber.fromValue(totalBlocks)
                );

                // total reward
                const reward = avgPrize.mul(
                    blocksClaimed.floor().toUnsafeFloat()
                );

                // APR
                const yearSeconds = constants.One.mul(365)
                    .mul(24)
                    .mul(60)
                    .mul(60);
                const yearBlocks = yearSeconds.div(targetInterval);

                const yearClaimed = stakePercentage.mulUnsafe(
                    FixedNumber.fromValue(yearBlocks)
                );

                const yearReward = avgPrize.mul(
                    yearClaimed.floor().toUnsafeFloat()
                );
                const apr = FixedNumber.fromValue(yearReward).divUnsafe(
                    FixedNumber.fromValue(stake)
                );

                return {
                    reward,
                    apr,
                    activeStake,
                };
            });

            // Sum up rewards
            reward = ratesPerChain.reduce(
                (prev, cur) => prev.add(cur.reward),
                constants.Zero
            );

            // Sum up aprs
            apr = ratesPerChain.reduce(
                (prev, cur) => prev.addUnsafe(cur.apr),
                FixedNumber.from(0)
            );

            // Average active stake
            activeStake = ratesPerChain
                .reduce(
                    (prev, cur) => prev.add(cur.activeStake),
                    constants.Zero
                )
                .div(ratesPerChain.length);
        }

        return {
            reward,
            apr,
            activeStake,
        };
    };

    return {
        blocks,
        loading,
        error,
        filters,
        refreshBlocks,
        loadNewBlocks,
        getRewardRate,
        getEstimatedRewardRate,
    };
};

export default useBlocks;
