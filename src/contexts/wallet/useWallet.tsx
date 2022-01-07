// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useContext, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { WalletConnectionContext } from './provider';
import { useWeb3React } from '@web3-react/core';
import { useFlag } from '@unleash/proxy-client-react';
import { WalletConnectionContextProps } from './definitions';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';

export type UseWallet = WalletConnectionContextProps &
    Partial<Web3ReactContextInterface<Web3Provider>>;

export const useWallet = (): UseWallet => {
    const multiWalletEnabled = useFlag('multiWalletEnabled');
    const onboardContext = useContext(WalletConnectionContext);
    const web3ReactContext = useWeb3React<Web3Provider>();
    const context = multiWalletEnabled ? onboardContext : web3ReactContext;

    useEffect(() => {
        const previousWallet = multiWalletEnabled
            ? web3ReactContext
            : onboardContext;

        if (previousWallet.active) {
            console.info(
                `Deactivating previous wallet/provider (${
                    multiWalletEnabled ? 'web3ReactProvider' : 'onboardJS'
                })`
            );
            previousWallet.deactivate();
        }
    }, [multiWalletEnabled]);
    return context;
};
