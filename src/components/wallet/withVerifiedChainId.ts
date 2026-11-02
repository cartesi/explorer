// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { UserRejectedRequestError } from 'viem';
import type { CreateConnectorFn } from 'wagmi';

type ConnectorInstance = ReturnType<CreateConnectorFn>;
type ConnectParameters = Parameters<ConnectorInstance['connect']>[0];
type ConnectResult = Awaited<ReturnType<ConnectorInstance['connect']>>;

const isUserRejection = (error: unknown): boolean => {
    const { code, cause } = (error ?? {}) as {
        code?: number;
        cause?: { code?: number };
    };
    return (
        code === UserRejectedRequestError.code ||
        cause?.code === UserRejectedRequestError.code
    );
};

/**
 * wagmi's `baseAccount` connector takes the connection chain from the first
 * entry of the `wallet_connect` reply, which is the chain it asked for rather
 * than the chain the wallet is on. Inside the Coinbase Wallet in-app browser
 * the two differ (the wallet defaults to Base), so wagmi reports a connection
 * on mainnet while the wallet client fails with ConnectorChainMismatchError and
 * RainbowKit, seeing a connection, no longer opens its modal.
 *
 * Read the wallet's real chain after connecting; when a chain was requested
 * and differs, ask the wallet to switch, otherwise report the real chain so
 * the app treats it like any other wallet on that chain. Upstream still has
 * the bug (@wagmi/connectors 8.x); see cowprotocol/cowswap#8366.
 */
export const withVerifiedChainId =
    (create: CreateConnectorFn): CreateConnectorFn =>
    (config) => {
        const connector = create(config);
        async function connect(
            this: ConnectorInstance,
            parameters?: ConnectParameters,
        ): Promise<ConnectResult> {
            const result = (await connector.connect.call(
                this,
                parameters,
            )) as ConnectResult;
            const actual = await this.getChainId().catch(() => undefined);
            if (actual === undefined || actual === result.chainId) {
                return result;
            }
            const target = parameters?.chainId;
            if (!target || target === actual || !this.switchChain) {
                return { ...result, chainId: actual };
            }
            try {
                const chain = await this.switchChain({ chainId: target });
                return { ...result, chainId: chain.id };
            } catch (error) {
                if (isUserRejection(error)) throw error;
                return { ...result, chainId: actual };
            }
        }
        // wagmi types `connect` as generic over `withCapabilities`; the
        // wrapper only forwards and adjusts `chainId`.
        return {
            ...connector,
            connect: connect as ConnectorInstance['connect'],
        };
    };
