// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import _ from 'lodash';
import { BigNumber, constants, FixedNumber } from 'ethers';
import { Block } from '../graphql/models';

export const getRewardRate = (
    blocks: Block[],
    rawCirculatingSupply: number
) => {
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
            const circulationSupply = BigNumber.from(rawCirculatingSupply).mul(
                constants.WeiPerEther
            );

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

export const getEstimatedRewardRate = (
    blocks: Block[],
    stake: BigNumber,
    totalStaked: number,
    period: number
) => {
    let reward = constants.Zero;
    let apr = FixedNumber.from(0);
    let activeStake = constants.Zero;
    let difficulty = constants.Zero;

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
            const reward = avgPrize.mul(blocksClaimed.floor().toUnsafeFloat());

            // APR
            const yearSeconds = constants.One.mul(365).mul(24).mul(60).mul(60);
            const yearBlocks = yearSeconds.div(targetInterval);

            const yearClaimed = stakePercentage.mulUnsafe(
                FixedNumber.fromValue(yearBlocks)
            );

            const yearReward = avgPrize.mul(
                yearClaimed.floor().toUnsafeFloat()
            );
            const apr = stake.eq(0)
                ? FixedNumber.from(0)
                : FixedNumber.fromValue(yearReward).divUnsafe(
                      FixedNumber.fromValue(stake)
                  );

            return {
                reward,
                apr,
                activeStake,
                difficulty,
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
            .reduce((prev, cur) => prev.add(cur.activeStake), constants.Zero)
            .div(ratesPerChain.length);

        // Average difficulty
        difficulty = ratesPerChain
            .reduce((prev, cur) => prev.add(cur.difficulty), constants.Zero)
            .div(ratesPerChain.length);
    }

    return {
        reward,
        apr,
        activeStake,
        difficulty,
    };
};
