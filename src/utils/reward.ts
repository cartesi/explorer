// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import _ from 'lodash';
import { Block } from '../graphql/models';
import { ratio, WAD } from './bigint';

const BLOCK_INTERVAL = 13;
const YEAR_SECONDS = 365n * 24n * 60n * 60n;

const average = (values: bigint[]): bigint =>
    values.length > 0
        ? values.reduce((sum, value) => sum + value, 0n) / BigInt(values.length)
        : 0n;

const groupByChain = (blocks: Block[]) =>
    _.groupBy(
        blocks,
        (block) => `${block.chain.protocol.version}-${block.chain.number}`,
    );

/** protocol 1 interval is in seconds, 2 is in blocks */
const targetIntervalSeconds = (protocol: number, targetInterval: number) =>
    protocol == 1 ? targetInterval : targetInterval * BLOCK_INTERVAL;

/** formula depends on protocol version */
const activeStakeOf = (
    protocol: number,
    difficulty: bigint,
    targetInterval: number,
) =>
    protocol == 1
        ? difficulty / BigInt(targetInterval)
        : (difficulty / BigInt(targetInterval)) * BigInt(10 ** 6);

export const getRewardRate = (
    blocks: Block[],
    rawCirculatingSupply: number,
) => {
    let participationRate = 0;
    let yearReturn = 0;

    if (blocks && blocks.length > 0 && rawCirculatingSupply) {
        const blocksPerChain = groupByChain(blocks);

        const ratesPerChain = Object.keys(blocksPerChain).map((chainId) => {
            const blocks: Array<Block> = blocksPerChain[chainId];
            const protocol = blocks[0].chain.protocol.version;
            const targetInterval = blocks[0].chain.targetInterval || 1;

            // take average difficulty of all blocks in array
            const difficulty = average(
                blocks.map((block) => BigInt(block.difficulty)),
            );

            const activeStake = activeStakeOf(
                protocol,
                difficulty,
                targetInterval,
            );

            // circulation supply in wei
            const circulationSupply = BigInt(rawCirculatingSupply) * WAD;

            // participation rate is a percentage of circulation supply
            const participationRate = ratio(activeStake, circulationSupply);

            // calculate average prize
            const reward = average(blocks.map((block) => BigInt(block.reward)));

            // total prize paid in one year
            const yearPrize =
                (YEAR_SECONDS /
                    BigInt(targetIntervalSeconds(protocol, targetInterval))) *
                reward;

            // calculate year return
            const yearReturn = ratio(yearPrize, activeStake);

            return {
                participationRate,
                yearReturn,
            };
        });

        // Average participation rate
        participationRate =
            ratesPerChain.reduce(
                (prev, cur) => prev + cur.participationRate,
                0,
            ) / ratesPerChain.length;

        // Sum up yearReturn
        yearReturn = ratesPerChain.reduce(
            (prev, cur) => prev + cur.yearReturn,
            0,
        );
    }

    return {
        participationRate,
        yearReturn,
    };
};

export const getEstimatedRewardRate = (
    blocks: Block[],
    stake: bigint,
    totalStaked: number,
    period: number,
) => {
    let reward = 0n;
    let apr = 0;
    let activeStake = 0n;

    if (blocks && blocks.length > 0) {
        const blocksPerChain = groupByChain(blocks);

        const ratesPerChain = Object.keys(blocksPerChain).map((chainId) => {
            const blocks: Array<Block> = blocksPerChain[chainId];
            const protocol = blocks[0].chain.protocol.version;
            const targetInterval = blocks[0].chain.targetInterval;

            const avgPrize = average(
                blocks.map((block) => BigInt(block.reward)),
            );

            // take average difficulty of all blocks in array
            const difficulty = average(
                blocks.map((block) => BigInt(block.difficulty)),
            );

            const intervalSeconds = BigInt(
                targetIntervalSeconds(protocol, targetInterval),
            );

            const activeStake = activeStakeOf(
                protocol,
                difficulty,
                targetInterval,
            );

            // user stake share
            const stakePercentage = ratio(
                stake,
                BigInt(totalStaked) * WAD + stake,
            );

            // investment period in seconds
            const periodSeconds = BigInt(period) * 24n * 60n * 60n;

            // number of block drawn in that period
            const totalBlocks = periodSeconds / intervalSeconds;

            // number of block claimed by the user (statistically)
            const blocksClaimed = Math.floor(
                stakePercentage * Number(totalBlocks),
            );

            // total reward
            const reward = avgPrize * BigInt(blocksClaimed);

            // APR
            const yearBlocks = YEAR_SECONDS / intervalSeconds;
            const yearClaimed = Math.floor(
                stakePercentage * Number(yearBlocks),
            );
            const yearReward = avgPrize * BigInt(yearClaimed);
            const apr = stake === 0n ? 0 : ratio(yearReward, stake);

            return {
                reward,
                apr,
                activeStake,
            };
        });

        // Sum up rewards
        reward = ratesPerChain.reduce((prev, cur) => prev + cur.reward, 0n);

        // Sum up aprs
        apr = ratesPerChain.reduce((prev, cur) => prev + cur.apr, 0);

        // Average active stake
        activeStake = average(ratesPerChain.map((cur) => cur.activeStake));
    }

    return {
        reward,
        apr,
        activeStake,
    };
};
