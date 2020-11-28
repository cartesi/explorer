// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { AddressZero } from '@ethersproject/constants';

export const useBalance = (address: string, deps: any[] = []) => {
    const { library } = useWeb3React<Web3Provider>();
    const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
    useEffect(() => {
        if (library) {
            library.getBalance(address).then(setBalance);
        }
    }, [library, address, ...deps]);
    return balance;
};

export const useAccount = (index: number) => {
    const { library } = useWeb3React<Web3Provider>();
    const [account, setAccount] = useState<string>(AddressZero);
    useEffect(() => {
        if (library) {
            library.listAccounts().then((accounts) => {
                setAccount(accounts.length > 0 ? accounts[index] : '');
            });
        }
    }, [library, index]);
    return account;
};

export const useBlockNumber = (): number => {
    const { chainId, library } = useWeb3React<Web3Provider>();
    const [blockNumber, setBlockNumber] = useState<number>(0);
    useEffect(() => {
        if (library) {
            let stale = false;
            library.getBlockNumber().then(setBlockNumber);
            const updateBlockNumber = (blockNumber: number) => {
                setBlockNumber(blockNumber);
            };
            library.on('block', updateBlockNumber);
            return () => {
                stale = true;
                library.removeListener('block', updateBlockNumber);
                setBlockNumber(undefined);
            };
        }
    }, [library, chainId]);
    return blockNumber;
};
