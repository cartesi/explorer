// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { isAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import { useEffect, useState } from 'react';
import { useWallet } from '../components/wallet';

export const useBalance = (address: string, deps: any[] = []): BigNumber => {
    const { library } = useWallet();
    const [balance, setBalance] = useState<BigNumber>(undefined);
    useEffect(() => {
        if (library) {
            if (isAddress(address)) {
                library.getBalance(address).then(setBalance);
            } else {
                setBalance(undefined);
            }
        }
    }, [library, address, ...deps]);
    return balance;
};

export const useBlockNumber = (): number => {
    const { chainId, library } = useWallet();
    const [blockNumber, setBlockNumber] = useState<number>(0);
    useEffect(() => {
        if (library) {
            library.getBlockNumber().then(setBlockNumber);
            const updateBlockNumber = (blockNumber: number) => {
                setBlockNumber(blockNumber);
            };
            library.on('block', updateBlockNumber);
            return () => {
                library.removeListener('block', updateBlockNumber);
                setBlockNumber(undefined);
            };
        }
    }, [library, chainId]);
    return blockNumber;
};
