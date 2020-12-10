// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { BigNumber, constants, FixedNumber } from 'ethers';

import _ from 'lodash';
import { BLOCKS } from '../queries/blocks';
import { Block, BlocksData, BlocksVars } from '../models';
import { useWeb3React } from '@web3-react/core';

interface IBlocksFilter {
    id?: string;
    number?: number;
    producer?: string;
    node?: string;
    timestamp_lt?: number;
    timestamp_gt?: number;
}

const useBlocks = (initFilter = {}) => {
    const { chainId } = useWeb3React();

    const [filter, setFilter] = useState<IBlocksFilter>(initFilter);
    const [searchKey, setSearchKey] = useState<string>('');

    const [blocks, setBlocks] = useState<Array<Block>>([]);

    const variables = {
        first: 10,
        skip: 0,
        where: null,
        orderBy: 'timestamp',
        orderDirection: 'desc',
    };

    const genFilter = (key: string) => {
        return searchKey
            ? {
                  ...filter,
                  [key]: searchKey.toLowerCase(),
              }
            : filter;
    };

    const {
        loading: idLoading,
        error: idError,
        data: idData,
        fetchMore: idFetchMore,
    } = useQuery<BlocksData, BlocksVars>(BLOCKS, {
        variables: {
            ...variables,
            where: genFilter('id'),
        },
        pollInterval: 30000,
    });

    const {
        loading: producerLoading,
        error: producerError,
        data: producerData,
        fetchMore: producerFetchMore,
    } = useQuery<BlocksData, BlocksVars>(BLOCKS, {
        variables: {
            ...variables,
            where: genFilter('producer'),
        },
        pollInterval: 30000,
    });

    const {
        loading: nodeLoading,
        error: nodeError,
        data: nodeData,
        fetchMore: nodeFetchMore,
    } = useQuery<BlocksData, BlocksVars>(BLOCKS, {
        variables: {
            ...variables,
            where: genFilter('node'),
        },
        pollInterval: 30000,
    });

    const [loading, setLoading] = useState<boolean>(false);
    const error = idError || producerError || nodeError;

    useEffect(() => {
        setBlocks([]);
    }, [chainId]);

    useEffect(() => {
        setLoading(idLoading || producerLoading || nodeLoading);
    }, [idLoading, producerLoading, nodeLoading]);

    useEffect(() => {
        if (producerData || nodeData) {
            setBlocks(
                _.unionBy(
                    blocks,
                    idData?.blocks || [],
                    producerData?.blocks || [],
                    nodeData?.blocks || [],
                    'id'
                )
            );
        }
    }, [idData, producerData, nodeData]);

    const loadMoreBlocks = async (): Promise<void> => {
        setLoading(true);

        const { data: producerData } = await producerFetchMore<
            BlocksData,
            BlocksVars,
            any
        >({
            variables: {
                skip: blocks.length,
                first: 10,
            },
        });

        const { data: nodeData } = await nodeFetchMore<
            BlocksData,
            BlocksVars,
            any
        >({
            variables: {
                skip: blocks.length,
                first: 10,
            },
        });

        const { data: idData } = await idFetchMore<BlocksData, BlocksVars, any>(
            {
                variables: {
                    skip: blocks.length,
                    first: 10,
                },
            }
        );

        setLoading(false);

        const newBlocks = _.unionBy(
            blocks,
            idData?.blocks || [],
            producerData?.blocks || [],
            nodeData?.blocks || [],
            'id'
        );

        setBlocks(newBlocks);
    };

    const updateFilter = (
        newFilter: IBlocksFilter,
        newSearchKey: string = null
    ) => {
        if (searchKey !== newSearchKey) {
            setBlocks([]);
        }

        setFilter(newFilter);
        setSearchKey(newSearchKey);
    };

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
        updateFilter,
        loadMoreBlocks,
        getRewardRate,
        getEstimatedRewardRate,
    };
};

export default useBlocks;
