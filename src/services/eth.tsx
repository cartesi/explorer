// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect, useState } from 'react';
import { isAddress } from 'viem';
import { useWallet } from '../components/wallet';

export const useBalance = (
    address: string,
    deps: any[] = [],
): bigint | undefined => {
    const { publicClient } = useWallet();
    const [balance, setBalance] = useState<bigint>(undefined);
    useEffect(() => {
        if (publicClient) {
            if (isAddress(address, { strict: false })) {
                publicClient.getBalance({ address }).then(setBalance);
            } else {
                setBalance(undefined);
            }
        }
    }, [publicClient, address, ...deps]);
    return balance;
};

export const useBlockNumber = (): number => {
    const { chainId, publicClient } = useWallet();
    const [blockNumber, setBlockNumber] = useState<number>(0);
    useEffect(() => {
        if (publicClient) {
            const unwatch = publicClient.watchBlockNumber({
                emitOnBegin: true,
                onBlockNumber: (value) => setBlockNumber(Number(value)),
                onError: () => undefined,
            });
            return () => {
                unwatch();
                setBlockNumber(undefined);
            };
        }
    }, [publicClient, chainId]);
    return blockNumber;
};
