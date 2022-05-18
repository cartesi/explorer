// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { ethers, BigNumber } from 'ethers';

const parse = (v: string, d: number) => ethers.utils.parseUnits(v, d);

export function toBigNumber(v: string, decimals?: number): BigNumber;
export function toBigNumber(v: number, decimals?: number): BigNumber;
export function toBigNumber(v: unknown, decimals = 18): BigNumber {
    if (typeof v === 'string') return parse(v, decimals);
    else if (typeof v === 'number') return parse(v.toString(), decimals);
    else throw new Error(`Supported value types are [ string, number ]`);
}
