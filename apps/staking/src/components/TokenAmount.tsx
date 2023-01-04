// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { BigNumber } from 'ethers';
import { formatCTSI } from '../utils/token';

export interface TokenAmountProps {
    amount: BigNumber;
    decimals?: number;
    locked?: boolean;
}

export const TokenAmount = (props: TokenAmountProps) => (
    <span className="info-text-md">
        {props.locked && <i className="fa fa-lock" aria-hidden="true"></i>}{' '}
        {formatCTSI(props.amount, props.decimals)}{' '}
        <span className="small-text">CTSI</span>
    </span>
);
