// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Web3Provider } from '@ethersproject/providers';
import { useFlag } from '@unleash/proxy-client-react';
import Onboard, {
    ConnectOptions,
    InitOptions,
    OnboardAPI,
    WalletState,
} from '@web3-onboard/core';
import { ConnectOptionsString } from '@web3-onboard/core/dist/types';
import injectedModule from '@web3-onboard/injected-wallets';
import ledgerModule from '@web3-onboard/ledger';
import walletConnectModule from '@web3-onboard/walletconnect';
import walletLinkModule from '@web3-onboard/walletlink';
import gnosisModule from '@web3-onboard/gnosis';
import { ethers } from 'ethers';
import { contains, debounce, keys, map, pick } from 'lodash/fp';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Network, networks } from '../../utils/networks';
import { CartesiIcon, CartesiLogo } from './cartesi-images-as-string';
import { UnsupportedNetworkError } from './errors/UnsupportedNetworkError';

const SELECTED_WALLETS = 'SELECTED_WALLETS_V2';
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const getRPC = (networkName: string): string =>
    `https://${networkName}.infura.io/v3/${PROJECT_ID}`;

const hardwareWallets = ['ledger'];
const supportedNetworks = map(parseInt)(keys(networks));

const injectedWallet = injectedModule();
const ledger = ledgerModule();
const walletConnect = walletConnectModule();
const walletLink = walletLinkModule({ darkMode: true });
const gnosis = gnosisModule();

const buildConfig = (ankrEnabled: boolean): InitOptions => {
    return {
        wallets: [injectedWallet, walletLink, gnosis, ledger, walletConnect],
        chains: [
            {
                id: `0x${Network.MAINNET}`,
                token: 'ETH',
                label: 'Ethereum Mainnet',
                rpcUrl: getRPC('mainnet'),
            },
            {
                id: `0x${Network.GOERLI}`,
                token: 'ETH',
                label: 'Goerli Testnet',
                rpcUrl: getRPC('goerli'),
            },
        ],
        appMetadata: {
            name: 'Cartesi Blockchain Explorer',
            logo: CartesiLogo,
            icon: CartesiIcon,
            description: 'A place where you can stake your CTSI and much more.',
        },
        // i18n: {
        //     en: {
        //         connect: {
        //             selectingWallet: {
        //                 header: 'Available Wallets',
        //                 sidebar: {
        //                     heading: 'Get Started',
        //                     subheading: 'Connect your wallet',
        //                     paragraph:
        //                         'Connecting your wallet is like “logging in” to Web3. Select your wallet from the options to get started.',
        //                 },
        //                 recommendedWalletsPart1: '{app} only supports',
        //                 recommendedWalletsPart2:
        //                     'on this platform. Please use or install one of the supported wallets to continue',
        //                 installWallet:
        //                     'You do not have any wallets installed that {app} supports, please use a supported wallet',
        //             },
        //         },
        //     },
        // },
    };
};

/**
 * Check what type of wallet is based on its label e.g. Ledger
 */
const isHardwareType = (label = '') =>
    contains(label.toLocaleLowerCase(), hardwareWallets);

const checkNetwork = (chainId: number): Error | null => {
    let error;

    if (chainId) {
        const isSupported = contains(chainId, supportedNetworks);
        error = !isSupported
            ? new UnsupportedNetworkError(chainId, supportedNetworks)
            : null;
    }
    return error;
};

const handlerBuilder =
    (stateUpdateCb: Dispatch<SetStateAction<PropState>>) =>
    (wallets: WalletState[]) => {
        const [connectedWallet] = wallets;
        if (connectedWallet?.provider) {
            const { label, chains, accounts } = connectedWallet;
            const chainId = parseInt(chains[0]?.id, 16);
            const account = accounts[0]?.address;

            const isHardwareWallet = isHardwareType(label);
            const error = checkNetwork(chainId);

            console.info(
                `Account: ${account}\nChain id: ${chainId}\nWallet Label: ${label}`
            );

            stateUpdateCb((state = {}) => ({
                ...state,
                error,
                account,
                chainId,
                isHardwareWallet,
                walletLabel: label,
            }));
        } else {
            console.info(
                `No provider for wallet label ${
                    connectedWallet?.label || 'no_label_defined'
                }.`
            );
            stateUpdateCb((state) => ({
                ...pick(['onboard'], state),
            }));
        }
    };

interface PropState {
    account?: string;
    library?: Web3Provider;
    chainId?: number;
    error?: Error;
    walletLabel?: string;
    isHardwareWallet?: boolean;
    selectAccount?: () => void;
    onboard?: OnboardAPI;
}

export const useOnboardV2 = () => {
    const [state, setState] = useState<PropState>({});
    const ankrEnabled = useFlag('ankrEnabled');
    const {
        account,
        library,
        chainId,
        error,
        isHardwareWallet,
        walletLabel,
        onboard,
    } = state;

    const active =
        library !== undefined &&
        account !== undefined &&
        chainId !== undefined &&
        !error;

    const connectWallet = async (
        options?: ConnectOptions | ConnectOptionsString
    ) => {
        const wallets = await onboard?.connectWallet(options);
        const [connectedWallet] = wallets;
        if (connectedWallet) {
            window.localStorage.setItem(
                SELECTED_WALLETS,
                connectedWallet.label
            );

            // Check and prompt the user to switch to mainnet
            onboard.setChain({ chainId: `0x${Network.MAINNET}` });
        }

        if (connectedWallet?.provider) {
            // Instantiate the web3provider only once.
            // with "any" the provider will handle the network change.
            const library = new ethers.providers.Web3Provider(
                connectedWallet.provider,
                'any'
            );
            setState((state) => ({ ...state, library } as PropState));
        }

        return wallets;
    };

    const disconnectWallet = async () => {
        const [connectedWallet] = onboard?.state.get().wallets;
        const wallets = await onboard?.disconnectWallet({
            label: connectedWallet.label,
        });

        window.localStorage.removeItem(SELECTED_WALLETS);
        return wallets;
    };

    const selectAccount = () => {
        if (isHardwareWallet && walletLabel) {
            connectWallet({ autoSelect: walletLabel });
        }
    };

    useEffect(() => {
        const onboard = Onboard(buildConfig(ankrEnabled));
        setState((state) => ({ ...state, onboard }));
    }, []);

    useEffect(() => {
        if (onboard) {
            const wallets$ = onboard.state.select('wallets');
            const debouncedHandler = debounce(500, handlerBuilder(setState));
            const subscription = wallets$.subscribe(debouncedHandler);

            return () => {
                console.info(`Unsubscribing update events (onboard V2)`);
                subscription.unsubscribe();
            };
        }
    }, [onboard]);

    return {
        error,
        chainId,
        account,
        library,
        active,
        isHardwareWallet,
        connectWallet,
        disconnectWallet,
        selectAccount,
    };
};
