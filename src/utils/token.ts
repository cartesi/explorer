// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { formatUnits, parseUnits } from 'viem';
import { Numeric, toBigInt, toFloat } from './bigint';

export const formatCTSI = (amount: Numeric, decimals = 18): string => {
    const numberFormat = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: decimals,
    });

    // convert to string
    return numberFormat.format(parseFloat(formatUnits(toBigInt(amount), 18)));
};

/** Amount in wei to CTSI as a float, for display. */
export const toCTSI = (amount: Numeric): number => toFloat(amount, 18);

export const toBigNumber = (value: number, decimals = 18): bigint =>
    parseUnits(value.toString(), decimals);
