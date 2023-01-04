// Copyright (C) 2022 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { ethers } from 'ethers';
import { toBigNumber } from '../../src/utils/numberParser';

describe('NumberParser functions', () => {
    it('should parse a number as string to ethers BigNumber', () => {
        const numberAsString = '3999999';
        expect(toBigNumber(numberAsString)).toEqual(
            ethers.utils.parseUnits(numberAsString, 18)
        );
    });

    it('should parse a number to ethers BigNumber equivalent', () => {
        const number = 1000.5;
        expect(toBigNumber(number)).toEqual(
            ethers.utils.parseUnits(number.toString(), 18)
        );
    });

    it('should throw an error when passing wrong type as value', () => {
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            toBigNumber(new Date());
        } catch (e) {
            expect(e.message).toEqual(
                'Supported value types are [ string, number ]'
            );
        }
    });
});
