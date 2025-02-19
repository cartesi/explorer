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
import coinbaseWalletModule from '@web3-onboard/coinbase';
import { AppMetadata, Chain } from '@web3-onboard/common';
import Onboard, {
    ConnectOptions,
    InitOptions,
    OnboardAPI,
    WalletState,
} from '@web3-onboard/core';
import { ConnectOptionsString } from '@web3-onboard/core/dist/types';
import gnosisModule from '@web3-onboard/gnosis';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import { WalletConnectOptions } from '@web3-onboard/walletconnect/dist/types';
import { ethers } from 'ethers';
import { contains, debounce, pick } from 'lodash/fp';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Network } from '../../utils/networks';
import { CartesiIcon, CartesiLogo } from './cartesi-images-as-string';
import { WalletType } from './definitions';
import { UnsupportedNetworkError } from './errors/UnsupportedNetworkError';

type NetworkName = keyof typeof Network;

const SELECTED_WALLETS = 'SELECTED_WALLETS_V2';
const dappUrl = process.env.NEXT_PUBLIC_DAPP_URL;
const WC_PROJECT_ID = process.env
    .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;

const rpcs = {
    MAINNET: process.env.NEXT_PUBLIC_RPC_URL_1 || 'https://rpc.ankr.com/eth',
    SEPOLIA:
        process.env.NEXT_PUBLIC_RPC_URL_11155111 ||
        'https://rpc.ankr.com/eth_sepolia',
    LOCAL: process.env.NEXT_PUBLIC_RPC_URL_31337 || 'http://localhost:8545',
} as const;

const getRPC = (networkName: NetworkName): string => rpcs[networkName];

console.info(`dapp-url: ${dappUrl}`);

const gnosisSafeLabels = ['gnosis safe', 'safe'];
const sdkWallets = new Set([...gnosisSafeLabels]);
const injectedWallets = new Set(['metamask', 'coinbase']);

const wcOptions: WalletConnectOptions = {
    projectId: WC_PROJECT_ID,
    requiredChains: [Network.MAINNET],
    dappUrl,
};

const injectedWallet = injectedModule();
const walletConnect = walletConnectModule(wcOptions);
const coinbase = coinbaseWalletModule({ darkMode: true });
const gnosis = gnosisModule();

export const convertToHex = (num: number): string => num.toString(16);

export const buildConfig = (
    ankrEnabled: boolean,
    chainIds: string[],
    appMetaData: Partial<AppMetadata> = {}
): InitOptions => {
    const chains: Chain[] = [
        {
            id: `0x${convertToHex(Network.MAINNET)}`,
            token: 'ETH',
            label: 'Ethereum Mainnet',
            rpcUrl: ankrEnabled
                ? 'https://rpc.ankr.com/eth'
                : getRPC('MAINNET'),
        },
        {
            id: `0x${convertToHex(Network.LOCAL)}`,
            token: 'ETH',
            label: 'localhost',
            rpcUrl: getRPC('LOCAL'),
        },
        {
            id: `0x${convertToHex(Network.SEPOLIA)}`,
            token: 'ETH',
            label: 'Sepolia Testnet',
            rpcUrl: getRPC('SEPOLIA'),
        },
    ].filter((c) => chainIds.includes(c.id));

    return {
        connect: {
            removeWhereIsMyWalletWarning: true,
        },
        accountCenter: {
            desktop: {
                enabled: false,
            },
            mobile: {
                enabled: false,
            },
        },
        wallets: [injectedWallet, coinbase, walletConnect, gnosis],
        chains,
        appMetadata: {
            name: 'Cartesi Blockchain Explorer',
            logo: CartesiLogo,
            icon: CartesiIcon,
            ...appMetaData,
        },
    };
};

/**
 * Check what type of wallet is based on its label e.g. Safe
 */
export const getWalletType = (label = ''): WalletType | null => {
    const name = label.toLocaleLowerCase();
    return injectedWallets.has(name)
        ? WalletType.INJECTED
        : sdkWallets.has(name)
        ? WalletType.SDK
        : null;
};

export const checkNetwork = (
    chainId: number,
    supportedNetworks: number[]
): Error | null | undefined => {
    let error;

    if (chainId) {
        const isSupported = contains(chainId, supportedNetworks);
        error = !isSupported
            ? new UnsupportedNetworkError(chainId, supportedNetworks)
            : null;
    }
    return error;
};

export const handlerBuilder =
    (stateUpdateCb: Dispatch<SetStateAction<PropState>>, chainIds: string[]) =>
    (wallets: WalletState[]) => {
        const [connectedWallet] = wallets;
        if (connectedWallet?.provider) {
            const { label, chains, accounts } = connectedWallet;
            const chainId = parseInt(chains[0]?.id);
            // Keep account info as lowercase to match
            // how that is indexed on the-graph.
            const account = accounts[0]?.address?.toLowerCase();

            const walletType = getWalletType(label);
            const isHardwareWallet = WalletType.HARDWARE === walletType;
            const isGnosisSafe =
                WalletType.SDK === walletType &&
                contains(label.toLowerCase(), gnosisSafeLabels);

            const chainIdsAsNumbers = chainIds.map((id) => parseInt(id, 16));
            const error = checkNetwork(chainId, chainIdsAsNumbers);

            console.info(
                `Account: ${account}\nChain id: ${chainId}\nWallet Label: ${label}`
            );

            stateUpdateCb(
                (state) =>
                    ({
                        ...state,
                        error,
                        account,
                        chainId,
                        isHardwareWallet,
                        isGnosisSafe,
                        walletType,
                        walletLabel: label,
                    } as PropState)
            );
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
    isHardwareWallet?: boolean;
    isGnosisSafe?: boolean;
    walletLabel?: string;
    walletType?: `${WalletType}`;
    selectAccount?: () => void;
    onboard?: OnboardAPI;
}

export interface UseOnboardProps {
    chainIds: string[];
    appMetaData?: Partial<AppMetadata>;
}

export const useOnboard = ({ chainIds, appMetaData }: UseOnboardProps) => {
    const [state, setState] = useState<PropState>({});
    const ankrEnabled = useFlag('ankrEnabled');
    const [isFirstNetworkChange, setFirstNetworkChange] =
        useState<boolean>(true);
    const {
        account,
        library,
        chainId,
        error,
        isHardwareWallet,
        isGnosisSafe,
        walletLabel,
        walletType,
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
        const [connectedWallet] = wallets ?? [];
        const mainNetId = `0x${convertToHex(Network.MAINNET)}`;

        if (connectedWallet) {
            window.localStorage.setItem(
                SELECTED_WALLETS,
                connectedWallet.label
            );

            // Check if MainNet is supported and this is prod/staging, then prompt the user to switch to MainNet
            if (
                chainIds.includes(mainNetId) &&
                process.env.NODE_ENV !== 'development'
            ) {
                onboard?.setChain({ chainId: mainNetId });
            }
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
        const [connectedWallet] = onboard?.state.get().wallets ?? [];
        const wallets = await onboard?.disconnectWallet({
            label: connectedWallet?.label,
        });
        setFirstNetworkChange(true);
        window.localStorage.removeItem(SELECTED_WALLETS);
        return wallets;
    };

    const selectAccount = () => {
        if (isHardwareWallet && walletLabel) {
            connectWallet({ autoSelect: walletLabel });
        }
    };

    useEffect(() => {
        const onboard = Onboard(
            buildConfig(ankrEnabled, chainIds, appMetaData)
        );
        setState((state) => ({ ...state, onboard }));
    }, []);

    useEffect(() => {
        if (onboard) {
            const wallets$ = onboard.state.select('wallets');
            const debouncedHandler = debounce(
                500,
                handlerBuilder(setState, chainIds)
            );
            const subscription = wallets$.subscribe(debouncedHandler);
            const previousWalletSelected =
                window.localStorage.getItem(SELECTED_WALLETS);

            if (previousWalletSelected)
                connectWallet({ autoSelect: previousWalletSelected });

            return () => {
                console.info(`Unsubscribing update events (onboard V2)`);
                subscription?.unsubscribe();
            };
        }
    }, [onboard, setState]);

    useEffect(() => {
        if (chainId !== undefined) {
            const selectedWallet =
                window.localStorage.getItem(SELECTED_WALLETS);
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

    return {
        error,
        chainId,
        account,
        library,
        active,
        isHardwareWallet,
        isGnosisSafe,
        walletName: walletLabel,
        walletType,
        connectWallet,
        disconnectWallet,
        selectAccount,
    };
};
