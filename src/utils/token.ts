// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { BigNumber, BigNumberish, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

export const formatCTSI = (
    amount: BigNumberish,
    decimals: number = 18
): string => {
    amount = BigNumber.from(amount);

    // floor value to number of decimals to display
    const m = constants.One.mul(10).pow(18 - decimals);
    amount = amount.sub(amount.mod(m));

    // convert to string
    return formatUnits(amount, 18);
};
