// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { formatUnits } from 'viem';

/** Values accepted where an integer amount is expected (wei, shares, ...). */
export type Numeric = bigint | number | string;

/** 1e18, the scale of 18-decimal tokens and of fixed-point ratios. */
export const WAD = 10n ** 18n;

/**
 * Converts an integer-like value to bigint. Numbers must be integers; use
 * parseUnits for decimal amounts.
 */
export const toBigInt = (value: Numeric): bigint =>
    typeof value === 'bigint' ? value : BigInt(value);

/** Integer division of (a * b) / c with no intermediate rounding. */
export const mulDiv = (a: bigint, b: bigint, c: bigint): bigint =>
    c === 0n ? 0n : (a * b) / c;

/**
 * Ratio of two integers as a float, with 18 decimals of precision. Replaces
 * ethers' FixedNumber, which was only used for display values.
 */
export const ratio = (numerator: bigint, denominator: bigint): number =>
    denominator === 0n
        ? 0
        : Number(formatUnits((numerator * WAD) / denominator, 18));

/** A token amount (18 decimals by default) as a float, for display only. */
export const toFloat = (value: Numeric, decimals = 18): number =>
    Number(formatUnits(toBigInt(value), decimals));
