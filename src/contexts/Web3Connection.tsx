// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { createContext, FC, useContext, useEffect, useState } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { networks } from '../utils/networks';
import { useWallet } from './wallet';
import { useFlag } from '@unleash/proxy-client-react';

const connector = new InjectedConnector({
    supportedChainIds: Object.keys(networks).map((key) => parseInt(key)),
});

const useEagerConnect = (multiWalletEnabled) => {
    const wallet = useWallet();
    const { activate, active } = wallet;
    const [tried, setTried] = useState(false);

    useEffect(() => {
        if (!multiWalletEnabled) {
            connector.isAuthorized().then((isAuthorized: boolean) => {
                if (isAuthorized) {
                    activate(connector, undefined, true).catch(() => {
                        setTried(true);
                    });
                } else {
                    setTried(true);
                }
            });
        }
    }, [multiWalletEnabled, activate]); // intentionally only running on mount (make sure it's only mounted once :))

    // if the connection worked, wait until we get confirmation of that to flip the flag
    useEffect(() => {
        if (!tried && active) {
            setTried(true);
        }
    }, [tried, active]);

    return tried;
};

const useInactiveListener = (suppress = false) => {
    const { active, error, activate, deactivate } = useWallet();

    useEffect(() => {
        const { ethereum } = window as any;
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleConnect = () => {
                activate(connector);
            };
            const handleChainChanged = () => {
                activate(connector);
            };
            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length > 0) {
                    activate(connector);
                } else {
                    deactivate();
                }
            };
            const handleNetworkChanged = () => {
                activate(connector);
            };

            ethereum.on('connect', handleConnect);
            ethereum.on('chainChanged', handleChainChanged);
            ethereum.on('accountsChanged', handleAccountsChanged);
            ethereum.on('networkChanged', handleNetworkChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('connect', handleConnect);
                    ethereum.removeListener('chainChanged', handleChainChanged);
                    ethereum.removeListener(
                        'accountsChanged',
                        handleAccountsChanged
                    );
                    ethereum.removeListener(
                        'networkChanged',
                        handleNetworkChanged
                    );
                }
            };
        }
    }, [active, error, suppress, activate]);
};

interface Web3ConnectionProviderProps {
    tried: boolean;
}

const Web3ConnectionContext = createContext<Web3ConnectionProviderProps>({
    tried: false,
});

const Web3ConnectionProvider: FC = (props) => {
    const multiWalletEnabled = useFlag('multiWalletEnabled');

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect(multiWalletEnabled);
    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    const suppressInactiveListeners = !triedEager || multiWalletEnabled;
    useInactiveListener(suppressInactiveListeners);
    return (
        <Web3ConnectionContext.Provider
            value={{ tried: triedEager }}
            {...props}
        />
    );
};
const useWeb3Connection = () => useContext(Web3ConnectionContext);
export { Web3ConnectionProvider, useWeb3Connection, connector };
