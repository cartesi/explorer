// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useContext, useState, useEffect } from 'react';
import Web3Context from '../components/Web3Context';
import { BigNumber } from '@ethersproject/bignumber';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const useBalance = (address: string, deps: any[] = []) => {
    const { provider } = useContext(Web3Context);
    const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
    useEffect(() => {
        if (provider) {
            provider.getBalance(address).then(setBalance);
        }
    }, [provider, address, ...deps]);
    return balance;
};

export const useAccount = (index: number) => {
    const { provider } = useContext(Web3Context);
    const [account, setAccount] = useState<string>(NULL_ADDRESS);
    useEffect(() => {
        if (provider) {
            provider.listAccounts().then((accounts) => {
                setAccount(accounts.length > 0 ? accounts[index] : '');
            });
        }
    }, [provider, index]);
    return account;
};
