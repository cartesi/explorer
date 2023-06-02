// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { formatCTSI, toCTSI, toBigNumber } from '../../src/utils/token';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { BigNumber, FixedNumber } from 'ethers';

describe('token util', () => {
    it('should correctly format CTSI', () => {
        const amount = BigNumber.from('100000000000000000');
        const decimals = 10;
        const numberFormat = new Intl.NumberFormat('en-US', {
            maximumFractionDigits: decimals,
        });

        expect(formatCTSI(amount, decimals)).toBe(
            numberFormat.format(parseFloat(formatUnits(amount, 18)))
        );
    });

    it('should correctly convert to CTSI', () => {
        const amount = BigNumber.from('100000000000000000');
        expect(toCTSI(amount)).toStrictEqual(
            FixedNumber.from(formatUnits(amount, 18))
        );
    });

    it('should correct convert to BigNumber', () => {
        const amount = 100000;
        const decimals = 10;

        expect(toBigNumber(amount, decimals)).toStrictEqual(
            parseUnits(amount.toString(), decimals)
        );
    });
});
