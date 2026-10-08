// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import type { Web3Provider } from '@ethersproject/providers';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useCallback, useEffect, useMemo } from 'react';
import type {
    Account,
    Chain,
    PublicClient,
    Transport,
    WalletClient,
} from 'viem';
import {
    useAccount,
    useAccountEffect,
    useDisconnect,
    usePublicClient,
    useSwitchChain,
    useWalletClient,
} from 'wagmi';
import { Network } from '../../utils/networks';
import { supportedChainIds } from './chains';
import { WalletType } from './definitions';
import { UnsupportedNetworkError } from './errors/UnsupportedNetworkError';
import { useEthersLibrary } from './ethersAdapter';

/** Key used by the previous wallet library to remember the selected wallet. */
const LEGACY_SELECTED_WALLETS = 'SELECTED_WALLETS_V2';

export const checkNetwork = (
    chainId: number | undefined,
    supportedNetworks: readonly number[] = supportedChainIds,
): Error | null | undefined => {
    if (chainId === undefined || chainId === null) return undefined;
    return supportedNetworks.includes(chainId)
        ? null
        : new UnsupportedNetworkError(chainId, supportedNetworks);
};

export const getWalletType = (connector?: {
    id: string;
    type: string;
}): `${WalletType}` | undefined => {
    if (!connector) return undefined;
    if (connector.id === 'safe') return WalletType.SDK;
    if (connector.type === 'injected' || connector.id === 'metaMaskSDK')
        return WalletType.INJECTED;
    return undefined;
};

export const shouldSwitchToMainnet = (
    chainId: number | undefined,
    env: string | undefined = process.env.NODE_ENV,
): boolean =>
    env !== 'development' &&
    supportedChainIds.includes(Network.MAINNET) &&
    chainId !== Network.MAINNET;

export interface WagmiWallet {
    error?: Error | null;
    chainId?: number;
    account?: string;
    /** @deprecated transitional ethers v5 provider; use publicClient/walletClient. */
    library?: Web3Provider;
    publicClient?: PublicClient<Transport, Chain>;
    walletClient?: WalletClient<Transport, Chain, Account>;
    active: boolean;
    isGnosisSafe: boolean;
    walletName?: string;
    walletType?: `${WalletType}`;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
}

/**
 * The only place that talks to wagmi and RainbowKit. Everything else consumes
 * the WalletConnectionContext through useWallet().
 */
export const useWagmiWallet = (): WagmiWallet => {
    const { address, chainId, connector, status } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { disconnect } = useDisconnect();
    const { switchChainAsync } = useSwitchChain();
    const isSupported =
        chainId !== undefined && supportedChainIds.includes(chainId);
    const publicClient = usePublicClient({
        chainId: isSupported ? chainId : undefined,
    });
    const { data: walletClient } = useWalletClient();
    const library = useEthersLibrary(connector);

    // Keep account info as lowercase to match how that is indexed on the-graph.
    const account = address?.toLowerCase();
    const error = useMemo(() => checkNetwork(chainId), [chainId]);
    const isGnosisSafe = connector?.id === 'safe';
    const walletName = connector?.name;
    const walletType = getWalletType(connector);
    const active =
        status === 'connected' &&
        library !== undefined &&
        account !== undefined &&
        chainId !== undefined &&
        !error;

    useAccountEffect({
        onConnect: ({ chainId: connectedChainId }) => {
            if (shouldSwitchToMainnet(connectedChainId)) {
                switchChainAsync({ chainId: Network.MAINNET }).catch(
                    () => undefined,
                );
            }
        },
    });

    useEffect(() => {
        window.localStorage.removeItem(LEGACY_SELECTED_WALLETS);
    }, []);

    const connectWallet = useCallback(async () => {
        openConnectModal?.();
    }, [openConnectModal]);

    const disconnectWallet = useCallback(() => {
        disconnect();
    }, [disconnect]);

    return {
        error,
        chainId,
        account,
        library,
        publicClient,
        walletClient,
        active,
        isGnosisSafe,
        walletName,
        walletType,
        connectWallet,
        disconnectWallet,
    };
};
