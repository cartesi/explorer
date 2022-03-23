// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { createContext, FC, useEffect, useState } from 'react';
import Onboard from 'bnc-onboard';
import { ethers } from 'ethers';
import {
    WalletInitOptions,
    WalletCheckInit,
} from 'bnc-onboard/dist/src/interfaces';
import { networks } from '../../utils/networks';
import { chains } from 'eth-chains';
import { WalletType, WalletConnectionContextProps } from './definitions';
import { UnsupportedNetworkError } from './errors/UnsupportedNetworkError';
import { useColorMode } from '@chakra-ui/react';
import { useFlag } from '@unleash/proxy-client-react';

const supportedNetworks = Object.keys(networks).map((key) => parseInt(key));
const SELECTED_WALLET = 'selectedWallet';
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const getRPC = (networkName: string): string =>
    `https://${networkName}.infura.io/v3/${PROJECT_ID}`;

const buildWalletOptions = (useAnkr: boolean): WalletInitOptions[] => {
    const mainnetRpcUrl = useAnkr
        ? 'https://rpc.ankr.com/eth'
        : getRPC('mainnet');
    return [
        { walletName: 'metamask' },
        {
            walletName: 'coinbase',
            infuraKey: PROJECT_ID,
        },
        {
            walletName: 'walletLink',
            rpcUrl: mainnetRpcUrl,
            appName: 'Cartesi Explorer',
        },
        { walletName: 'gnosis' },
        { walletName: 'trust' },
        { walletName: 'ledger', rpcUrl: mainnetRpcUrl },
        {
            walletName: 'walletConnect',
            rpc: {
                '1': mainnetRpcUrl,
                '3': getRPC('ropsten'),
                '5': getRPC('goerli'),
            },
        },
    ];
};

const walletCheck: WalletCheckInit[] = [
    { checkName: 'derivationPath' },
    { checkName: 'accounts' },
    { checkName: 'connect' },
    { checkName: 'network' },
];

const initialContextState = {
    active: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    activate: async () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    deactivate: () => {},
};
export const WalletConnectionContext =
    createContext<WalletConnectionContextProps>(initialContextState);

export const WalletConnectionProvider: FC = (props) => {
    const [state, setState] = useState<WalletConnectionContextProps>({
        ...initialContextState,
    });
    const [isFirstNetworkChange, setFirstNetworkChange] = useState(true);
    const { library, account, chainId, error, onboard } = state;
    const { colorMode } = useColorMode();
    const multiWalletEnabled = useFlag('multiWalletEnabled');
    const ankrEnabled = useFlag('ankrEnabled');

    const active =
        library !== undefined &&
        account !== undefined &&
        chainId !== undefined &&
        !error;

    const activate = async () => {
        const { onboard } = state;
        const walletSelected = await onboard?.walletSelect();
        if (!walletSelected) return;
        await onboard.walletCheck();
    };

    const deactivate = () => {
        const { onboard } = state;
        onboard?.walletReset();
        window.localStorage.removeItem(SELECTED_WALLET);
    };

    useEffect(() => {
        console.log(
            `Initializing onboarding.\nIs ankr enabled: ${ankrEnabled}`
        );
        const wallets = buildWalletOptions(ankrEnabled);
        const onboardInitialized = Onboard({
            hideBranding: true,
            networkId: supportedNetworks[0],
            blockPollingInterval: 1200000,
            subscriptions: {
                wallet: (wallet) => {
                    const { provider, name, type } = wallet;
                    if (provider) {
                        const ethersProvider =
                            new ethers.providers.Web3Provider(provider, 'any');

                        console.log(`Wallet selected: ${name}`);
                        window.localStorage.setItem(SELECTED_WALLET, name);

                        setState((state) => ({
                            ...state,
                            library: ethersProvider,
                            isHardwareWallet: type === WalletType.HARDWARE,
                        }));
                    } else {
                        setState((state) => ({
                            ...state,
                            library: null,
                            isHardwareWallet: false,
                        }));
                    }
                },
                address: (address: string) => {
                    console.log(`Address changed to: ${address}`);
                    setState((state) => ({ ...state, account: address }));
                },
                network: (networkId: number) => {
                    let error = null;
                    if (networkId !== undefined) {
                        const isNetworkSupported =
                            supportedNetworks.includes(networkId);

                        error = !isNetworkSupported
                            ? new UnsupportedNetworkError(
                                  networkId,
                                  supportedNetworks
                              )
                            : null;
                    }

                    const chain = chains.getById(networkId);
                    console.log(
                        `Network changed to: ${chain?.name || networkId}`
                    );
                    setState((state) => ({
                        ...state,
                        chainId: networkId,
                        error,
                    }));
                },
            },
            walletSelect: {
                wallets,
            },
            walletCheck,
        });

        console.log(`Onboard initialized.`);

        setState((state) => ({ ...state, onboard: onboardInitialized }));
    }, []);

    useEffect(() => {
        if (chainId !== undefined) {
            const selectedWallet = window.localStorage.getItem(SELECTED_WALLET);
            if (selectedWallet?.toLowerCase() === 'walletconnect') {
                console.log(`Network changed using ${selectedWallet}`);
                if (!isFirstNetworkChange) {
                    // Just in case the network is changed,
                    // The provider will come clean when is the WalletConnect protocol.
                    window.location.reload();
                } else {
                    console.info(
                        'Skipping reload because it was the first network change'
                    );
                    setFirstNetworkChange(false);
                }
            } else {
                console.log(
                    `Skipping the page reload since is not WalletConnect. The selected one is ${selectedWallet}`
                );
            }
        }
    }, [chainId]);

    useEffect(() => {
        const previousWalletSelected =
            window.localStorage.getItem(SELECTED_WALLET);
        if (onboard && multiWalletEnabled) {
            console.log(
                `Setting up pre-selected wallet: ${
                    previousWalletSelected
                        ? previousWalletSelected
                        : 'no-wallet-selected previously'
                }`
            );
            if (previousWalletSelected) {
                onboard
                    .walletSelect(previousWalletSelected)
                    .then(async (selected) => {
                        if (selected) {
                            const switchedChain = await onboard.walletCheck();
                            if (!switchedChain)
                                console.log(
                                    `User rejected the request to switch to mainnet`
                                );
                        }
                    });
            }
            setState((state) => ({ ...state, tried: true }));
        }
    }, [onboard, multiWalletEnabled]);

    useEffect(() => {
        const { onboard } = state;
        if (onboard) {
            const darkMode = 'dark' === colorMode;
            onboard.config({ darkMode });
        }
    }, [colorMode]);

    const defaults = { activate, active, deactivate, error };
    const value = active ? { ...state, ...defaults } : defaults;

    return (
        <WalletConnectionContext.Provider value={value}>
            {props.children}
        </WalletConnectionContext.Provider>
    );
};
