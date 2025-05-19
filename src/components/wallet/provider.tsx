// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { createContext, FC, PropsWithChildren } from 'react';
import { WalletConnectionContextProps } from './definitions';
import { useOnboard, UseOnboardProps } from './useOnboard';

const initialContextState = {
    active: false,
    activate: async () => undefined,
    deactivate: () => undefined,
};

export const WalletConnectionContext =
    createContext<WalletConnectionContextProps>(initialContextState);

export interface WalletConnectionProviderProps
    extends PropsWithChildren,
        UseOnboardProps {}

export const WalletConnectionProvider: FC<WalletConnectionProviderProps> = (
    props
) => {
    const { children, chainIds, appMetaData } = props;
    const {
        library,
        account,
        chainId,
        error,
        active,
        isHardwareWallet,
        isGnosisSafe,
        walletName,
        walletType,
        connectWallet,
        disconnectWallet,
        selectAccount,
    } = useOnboard({ chainIds, appMetaData });

    const activate = async () => {
        await connectWallet();
    };

    const deactivate = () => {
        disconnectWallet();
    };

    const defaults = { activate, active, deactivate, error };
    const value = active
        ? {
              library,
              account,
              chainId,
              selectAccount,
              isHardwareWallet,
              isGnosisSafe,
              walletName,
              walletType,
              ...defaults,
          }
        : defaults;

    return (
        <WalletConnectionContext.Provider value={value}>
            {children}
        </WalletConnectionContext.Provider>
    );
};
