// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useFlag, useUnleashContext } from '@unleash/proxy-client-react';
import { createContext, FC, useEffect } from 'react';
import { WalletConnectionContextProps } from './definitions';
import { useOnboardV1 } from './useOnboardV1';
import { useOnboardV2 } from './useOnboardV2';

const initialContextState = {
    active: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    activate: async () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    deactivate: () => {},
};

const useOnboard = () => {
    const v2Enabled = useFlag('onboardV2Enabled');
    const v1 = useOnboardV1();
    const v2 = useOnboardV2();

    useEffect(() => {
        const prevWallet = v2Enabled ? v1 : v2;
        if (prevWallet.active) {
            console.info(
                `Wallet provider switched\n Disconnecting the previous one (${
                    v2Enabled ? 'Onboard V1' : 'Onboard V2'
                })`
            );

            prevWallet.disconnectWallet();
        }
    }, [v2Enabled, v1, v2]);

    return v2Enabled ? v2 : v1;
};

export const WalletConnectionContext =
    createContext<WalletConnectionContextProps>(initialContextState);

export const WalletConnectionProvider: FC = (props) => {
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
