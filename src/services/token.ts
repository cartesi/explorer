// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { asAddress, useCartesiTokenContract } from './contracts';
import { useTransaction } from './transaction';

export const useCartesiToken = (
    account: string = null,
    spender: string = null,
    blockNumber = 0,
) => {
    const token = useCartesiTokenContract();
    const [balance, setBalance] = useState<bigint>(0n);
    const [allowance, setAllowance] = useState<bigint>(0n);
    const transaction = useTransaction<void>();

    // balances
    useEffect(() => {
        if (token && account) {
            token.read.balanceOf([asAddress(account)]).then(setBalance);
            if (spender) {
                token.read
                    .allowance([asAddress(account), asAddress(spender)])
                    .then(setAllowance);
            }
        } else {
            setBalance(0n);
            setAllowance(0n);
        }
    }, [token, account, spender, blockNumber]);

    const approve = (spender: string, amount: bigint) => {
        if (token) {
            transaction.set(token.write.approve([asAddress(spender), amount]));
        }
    };

    const parseCTSI = (amount: number): bigint => {
        amount = amount * 1000;
        return parseUnits(amount.toString(), 15);
    };

    const toCTSI = (amount: bigint): number => {
        return parseInt(formatUnits(amount, 18));
    };

    const toBigCTSI = (amount: bigint): bigint => {
        return BigInt(toCTSI(amount));
    };

    return {
        allowance,
        balance,
        transaction,
        approve,
        parseCTSI,
        toCTSI,
        toBigCTSI,
    };
};
