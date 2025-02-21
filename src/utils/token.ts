// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { BigNumberish, FixedNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

export const formatCTSI = (amount: BigNumberish, decimals = 18): string => {
    const numberFormat = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: decimals,
    });

    // convert to string
    return numberFormat.format(parseFloat(formatUnits(amount, 18)));
};

export const toCTSI = (amount: BigNumberish): FixedNumber => {
    return FixedNumber.from(formatUnits(amount, 18));
};

export const toBigNumber = (value: number, decimals = 18) =>
    parseUnits(value.toString(), decimals);
