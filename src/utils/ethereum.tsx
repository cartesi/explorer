// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { ethers, BigNumber } from 'ethers';

export const provider = new ethers.providers.Web3Provider(window.ethereum);

export const useBalance = (address: string) => {
    const [balance, setBalance] = useState<BigNumber | undefined>(undefined);
    useEffect(() => {
        const getBalance = async () => {
            setBalance(await provider.getBalance(address));
        };
        getBalance();
    }, [address]);
    return balance;
};
