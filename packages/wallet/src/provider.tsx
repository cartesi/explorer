// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useUnleashContext } from '@unleash/proxy-client-react';
import { createContext, FC, useEffect, PropsWithChildren } from 'react';
import { WalletConnectionContextProps } from './definitions';
import { useOnboard } from './useOnboard';

const initialContextState = {
    active: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    activate: async () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    deactivate: () => {},
};

export const WalletConnectionContext =
    createContext<WalletConnectionContextProps>(initialContextState);

export const WalletConnectionProvider: FC<PropsWithChildren> = (props) => {
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
    } = useOnboard();

    const updateUnleashCtx = useUnleashContext();

    const activate = async () => {
        await connectWallet();
    };

    const deactivate = () => {
        disconnectWallet();
    };

    useEffect(() => {
        updateUnleashCtx({ userId: account || '' });
    }, [active, account, updateUnleashCtx]);

    const defaults = { activate, active, deactivate, error };
    const value = active
        ? {
              library,
              account,
              chainId,
              error,
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
            {props.children}
        </WalletConnectionContext.Provider>
    );
};
