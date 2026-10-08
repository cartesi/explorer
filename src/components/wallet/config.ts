// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
    base,
    ledgerWallet,
    metaMaskWallet,
    rainbowWallet,
    safeWallet,
    trustWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { mainnet, sepolia } from 'viem/chains';
import { createConfig, http, type Config, type CreateConnectorFn } from 'wagmi';
import { Network } from '../../utils/networks';
import { chains, local } from './chains';

const dappUrl = process.env.NEXT_PUBLIC_DAPP_URL;
const ankrEnabled = process.env.NEXT_PUBLIC_FLAG_ANKR_ENABLED === 'true';

export const appMetadata = {
    name: 'Cartesi Blockchain Explorer',
    description: 'A place where you can stake your CTSI and much more.',
    url: dappUrl,
    icon: `${dappUrl}/images/cartesi-logo.png`,
} as const;

export const rpcUrls: Record<Network, string> = {
    [Network.MAINNET]: ankrEnabled
        ? 'https://rpc.ankr.com/eth'
        : process.env.NEXT_PUBLIC_RPC_URL_1 || 'https://rpc.ankr.com/eth',
    [Network.SEPOLIA]:
        process.env.NEXT_PUBLIC_RPC_URL_11155111 ||
        'https://rpc.ankr.com/eth_sepolia',
    [Network.LOCAL]:
        process.env.NEXT_PUBLIC_RPC_URL_31337 || 'http://localhost:8545',
};

/**
 * RainbowKit shows exactly this list (also on mobile). Safe only appears
 * inside the Safe web interface and connects automatically.
 */
export const createConnectors = (): CreateConnectorFn[] =>
    connectorsForWallets(
        [
            {
                groupName: 'Recommended',
                wallets: [
                    metaMaskWallet,
                    walletConnectWallet,
                    safeWallet,
                    base,
                ],
            },
            {
                groupName: 'More',
                wallets: [ledgerWallet, rainbowWallet, trustWallet],
            },
        ],
        {
            appName: appMetadata.name,
            appDescription: appMetadata.description,
            appUrl: appMetadata.url,
            appIcon: appMetadata.icon,
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        },
    );

export const createWagmiConfig = (
    connectors: CreateConnectorFn[] = createConnectors(),
): Config =>
    createConfig({
        chains,
        transports: {
            [mainnet.id]: http(rpcUrls[Network.MAINNET]),
            [sepolia.id]: http(rpcUrls[Network.SEPOLIA]),
            [local.id]: http(rpcUrls[Network.LOCAL]),
        },
        connectors,
        // Web3Container is rendered client-side only (next/dynamic with ssr: false).
        ssr: false,
    });

let wagmiConfig: Config | undefined;

/** Connectors set themselves up at creation, so one config per page load. */
export const getWagmiConfig = (): Config => {
    if (!wagmiConfig) {
        console.info(`dapp-url: ${dappUrl}`);
        wagmiConfig = createWagmiConfig();
    }
    return wagmiConfig;
};
