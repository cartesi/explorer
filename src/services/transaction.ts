// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useWeb3React } from '@web3-react/core';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { useEffect, useState } from 'react';
import { confirmations } from '../utils/networks';

export interface Transaction {
    transaction: ContractTransaction;
    error?: string;
    receipt?: ContractReceipt;
}

export const useTransaction = () => {
    const { chainId } = useWeb3React();
    const [error, setError] = useState<string>();
    const [transaction, set] = useState<ContractTransaction>();
    const [receipt, setReceipt] = useState<ContractReceipt>();

    useEffect(() => {
        const update = async () => {
            setError(null);
            try {
                // wait for confirmations
                setReceipt(await transaction.wait(confirmations[chainId]));
            } catch (e) {
                setError(e.message);
            }
        };
        if (transaction) {
            update();
        }
    }, [transaction]);

    return {
        transaction,
        error,
        receipt,
        set,
    };
};
