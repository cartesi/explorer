// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { BigNumber } from 'ethers';
import { Block } from '../../src/graphql/models';
import { getEstimatedRewardRate, getRewardRate } from '../../src/utils/reward';

/**
 * Characterization tests: the expected values below were captured from the
 * ethers v5 (BigNumber / FixedNumber) implementation and pin its behaviour so
 * the bigint port must reproduce the same numbers. Results are compared as
 * plain numbers and decimal strings so the assertions do not depend on the
 * numeric library in use.
 */
const asNumber = (value: unknown): number =>
    typeof value === 'number' ? value : Number(String(value));

const asString = (value: unknown): string => String(value);

const block = (
    protocol: 1 | 2,
    chainNumber: number,
    targetInterval: number,
    difficulty: string,
    reward: string,
): Block =>
    ({
        id: `${protocol}-${chainNumber}-${difficulty}`,
        number: 1,
        timestamp: 1700000000,
        reward,
        difficulty,
        commission: '0',
        gasPrice: 1,
        gasLimit: 1,
        producer: undefined,
        node: undefined,
        chain: {
            id: `${protocol}-${chainNumber}`,
            number: chainNumber,
            totalBlocks: 1,
            totalReward: '0',
            start: '0',
            targetInterval,
            protocol: {
                id: `${protocol}`,
                version: protocol,
                address: '0x0000000000000000000000000000000000000000',
                timestamp: 0,
                totalChains: 1,
            },
        },
    }) as unknown as Block;

// protocol 2: targetInterval in blocks, difficulty scaled by 1e-6
const v2Blocks = [
    block(2, 0, 138, '34500000000000000000000', '2900000000000000000000'),
    block(2, 0, 138, '36000000000000000000000', '2900000000000000000000'),
    block(2, 0, 138, '33000000000000000000000', '2800000000000000000000'),
];

// protocol 1: targetInterval in seconds
const v1Blocks = [
    block(
        1,
        3,
        1800,
        '450000000000000000000000000000',
        '1700000000000000000000',
    ),
    block(
        1,
        3,
        1800,
        '468000000000000000000000000000',
        '1700000000000000000000',
    ),
];

const circulatingSupply = 700_000_000;
const stake = '5000000000000000000000000'; // 5,000,000 CTSI in wei
const totalStaked = 250_000_000; // CTSI
const period = 30; // days

/** Relative comparison: ratios are decimal strings today and floats after the port. */
const expectRatio = (actual: unknown, expected: number | string) =>
    Number(expected) === 0
        ? expect(asNumber(actual)).toBe(0)
        : expect(asNumber(actual) / Number(expected)).toBeCloseTo(1, 9);

/** The stake parameter is an ethers BigNumber today and a bigint after the port. */
const toStake = (wei: string) => BigNumber.from(wei);

describe('reward utils (characterization)', () => {
    describe('getRewardRate', () => {
        it('returns zero rates without blocks or supply', () => {
            expectRatio(getRewardRate([], circulatingSupply).yearReturn, 0);
            expectRatio(
                getRewardRate([], circulatingSupply).participationRate,
                0,
            );
            expectRatio(getRewardRate(v2Blocks, 0).participationRate, 0);
            expectRatio(getRewardRate(v2Blocks, 0).yearReturn, 0);
        });

        it('computes participation and yearly return for a protocol 2 chain', () => {
            const { participationRate, yearReturn } = getRewardRate(
                v2Blocks,
                circulatingSupply,
            );
            expectRatio(participationRate, '0.357142857142857142');
            expectRatio(yearReturn, '0.201561066666666666');
        });

        it('computes participation and yearly return for a protocol 1 chain', () => {
            const { participationRate, yearReturn } = getRewardRate(
                v1Blocks,
                circulatingSupply,
            );
            expectRatio(participationRate, '0.364285714285714285');
            expectRatio(yearReturn, 0.1168);
        });

        it('averages participation and sums returns across chains', () => {
            const { participationRate, yearReturn } = getRewardRate(
                [...v2Blocks, ...v1Blocks],
                circulatingSupply,
            );
            expectRatio(participationRate, '0.360714285714285713');
            expectRatio(yearReturn, '0.318361066666666666');
        });
    });

    describe('getEstimatedRewardRate', () => {
        it('estimates reward, apr and active stake for a protocol 2 chain', () => {
            const { reward, apr, activeStake } = getEstimatedRewardRate(
                v2Blocks,
                toStake(stake),
                totalStaked,
                period,
            );
            expect(asString(reward)).toBe('80266666666666666666648');
            expectRatio(apr, '0.197226666666666666');
            expect(asString(activeStake)).toBe('250000000000000000000000000');
        });

        it('sums rewards and aprs and averages active stake across chains', () => {
            const { reward, apr, activeStake } = getEstimatedRewardRate(
                [...v2Blocks, ...v1Blocks],
                toStake(stake),
                totalStaked,
                period,
            );
            expect(asString(reward)).toBe('127866666666666666666648');
            expectRatio(apr, '0.313846666666666666');
            expect(asString(activeStake)).toBe('252500000000000000000000000');
        });

        it('yields no reward and a zero apr without a stake', () => {
            const { reward, apr, activeStake } = getEstimatedRewardRate(
                v2Blocks,
                toStake('0'),
                totalStaked,
                period,
            );
            expect(asString(reward)).toBe('0');
            expectRatio(apr, 0);
            expect(asString(activeStake)).toBe('250000000000000000000000000');
        });

        it('still reports the active stake for the stats endpoint call shape', () => {
            // app/api/[chain]/stats/route.ts calls it with a 1 wei stake and no period
            const { reward, apr, activeStake } = getEstimatedRewardRate(
                v2Blocks,
                toStake('1'),
                0,
                0,
            );
            expect(asString(reward)).toBe('0');
            expectRatio(apr, '50390266666666666666654948');
            expect(asString(activeStake)).toBe('250000000000000000000000000');
        });

        it('returns zeros without blocks', () => {
            const { reward, apr, activeStake } = getEstimatedRewardRate(
                [],
                toStake(stake),
                totalStaked,
                period,
            );
            expect(asString(reward)).toBe('0');
            expectRatio(apr, 0);
            expect(asString(activeStake)).toBe('0');
        });
    });
});
