// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

'use client';

/**
 * On-page wallet diagnostics for browsers without devtools, such as wallet
 * in-app browsers. Development builds only.
 *
 * Shows a frozen, copyable JSON snapshot of the wagmi, RainbowKit and injected
 * provider state (the chain wagmi recorded against the chain the connector and
 * `window.ethereum` report, the wallet client error, whether RainbowKit would
 * open its modal, recent console errors), with buttons that ask the wallet to
 * switch chain. Minimize collapses it to a corner pill.
 *
 * @example
 * // Turn it on (remembered for the session until turned off):
 * //   http://localhost:3000/?walletDebug=1
 * // Turn it off: the Hide button, or
 * //   http://localhost:3000/?walletDebug=0
 * // From a phone on the same network, run `pnpm next:dev -H 0.0.0.0`, allow
 * // the host in next.config.js (`allowedDevOrigins`) and open
 * //   http://<host-ip>:3000/?walletDebug=1
 */

import { Box, Button, HStack, Text, Textarea } from '@chakra-ui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { FC, useEffect, useEffectEvent, useState } from 'react';
import { useAccount, useChainId, useConfig, useSwitchChain } from 'wagmi';
import { Network } from '../../../utils/networks';
import { useWallet } from '../useWallet';
import {
    clearWalletDebugFlag,
    isWalletDebugEnabled,
    isWalletDebugMinimized,
    setWalletDebugMinimized,
} from './walletDebugFlag';
import { describeError, getWalletDebugEntries } from './walletDebugLog';

/** The result of a request as a string, errors included. */
const settle = async (request: () => Promise<unknown>): Promise<string> => {
    try {
        return String(await request());
    } catch (error) {
        return `error: ${describeError(error)}`;
    }
};

const readInjected = () => {
    const injected = window.ethereum;
    let topDiffersFromWindow: boolean | string;
    try {
        topDiffersFromWindow = window.top?.ethereum !== injected;
    } catch (error) {
        topDiffersFromWindow = describeError(error);
    }
    return {
        present: !!injected,
        isCoinbaseWallet: injected?.isCoinbaseWallet,
        isCoinbaseBrowser: injected?.isCoinbaseBrowser,
        isMetaMask: injected?.isMetaMask,
        providersCount: injected?.providers?.length,
        topDiffersFromWindow,
    };
};

const WalletDebugOverlay: FC<{ onHide: () => void }> = ({ onHide }) => {
    const { address, chainId, connector, status } = useAccount();
    const configChainId = useChainId();
    const { connectors } = useConfig();
    const { openConnectModal, connectModalOpen } = useConnectModal();
    const { switchChainAsync } = useSwitchChain();
    const { active, error, walletClientError } = useWallet();
    const [switchResult, setSwitchResult] = useState<string>();
    const [notice, setNotice] = useState<string>();
    const [json, setJson] = useState('');
    // Remembered in storage, so a reload keeps the overlay out of the way.
    const [minimized, setMinimized] = useState(isWalletDebugMinimized);

    // The JSON on screen is frozen, so it can be selected and copied; it is
    // retaken on Refresh and on a wagmi state change, probing the chains then.
    const takeSnapshot = async () => {
        const injected = window.ethereum;
        const [connectorChainId, injectedChainId] = await Promise.all([
            connector && settle(() => connector.getChainId()),
            injected?.request &&
                settle(() => injected.request({ method: 'eth_chainId' })),
        ]);
        const snapshot = {
            capturedAt: new Date().toISOString(),
            app: {
                active,
                error: error && describeError(error),
                walletClientError:
                    walletClientError && describeError(walletClientError),
            },
            wagmi: {
                status,
                address,
                chainId,
                configChainId,
                connector: connector && {
                    id: connector.id,
                    name: connector.name,
                    type: connector.type,
                },
                connectorIds: connectors.map(({ id }) => id),
            },
            probes: { connectorChainId, injectedChainId },
            rainbowKit: {
                openConnectModalDefined: openConnectModal !== undefined,
                connectModalOpen,
            },
            injected: readInjected(),
            env: { userAgent: navigator.userAgent, href: window.location.href },
            switchResult,
            logs: getWalletDebugEntries(),
        };
        setJson(JSON.stringify(snapshot, null, 2));
    };

    const onStateChange = useEffectEvent(takeSnapshot);
    useEffect(() => {
        onStateChange();
    }, [status, chainId, connector, walletClientError, switchResult]);

    const minimize = (value: boolean) => {
        setWalletDebugMinimized(value);
        setMinimized(value);
    };

    const copy = () => {
        if (!navigator.clipboard?.writeText) {
            setNotice('no clipboard API: select the text box and copy');
            return;
        }
        navigator.clipboard
            .writeText(json)
            .then(() => setNotice('copied'))
            .catch((err) => setNotice(`copy failed: ${describeError(err)}`));
    };

    const switchTo = (target: Network) => {
        setSwitchResult(`switching to ${target}...`);
        switchChainAsync({ chainId: target })
            .then((chain) => setSwitchResult(`switched to ${chain.id}`))
            .catch((err) =>
                setSwitchResult(
                    `switch to ${target} failed: ${describeError(err)}`,
                ),
            );
    };

    if (minimized) {
        return (
            <Button
                position="fixed"
                bottom={2}
                right={2}
                zIndex="max"
                size="xs"
                colorPalette="gray"
                variant="solid"
                onClick={() => minimize(false)}
                data-testid="wallet-debug-pill"
            >
                Wallet debug
            </Button>
        );
    }

    return (
        <Box
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            maxH="55vh"
            overflowY="auto"
            zIndex="max"
            bg="blackAlpha.900"
            color="white"
            fontSize="xs"
            fontFamily="mono"
            p={2}
            data-testid="wallet-debug-panel"
        >
            <HStack gap={2} mb={2} flexWrap="wrap">
                <Text fontWeight="bold">Wallet debug</Text>
                <Button size="xs" onClick={takeSnapshot}>
                    Refresh
                </Button>
                <Button size="xs" onClick={copy}>
                    Copy JSON
                </Button>
                <Button size="xs" onClick={() => switchTo(Network.SEPOLIA)}>
                    Switch to Sepolia
                </Button>
                <Button size="xs" onClick={() => switchTo(Network.MAINNET)}>
                    Switch to Mainnet
                </Button>
                <Button size="xs" onClick={() => minimize(true)}>
                    Minimize
                </Button>
                <Button
                    size="xs"
                    onClick={() => {
                        clearWalletDebugFlag();
                        onHide();
                    }}
                >
                    Hide
                </Button>
                {notice && <Text>{notice}</Text>}
            </HStack>
            <Textarea
                readOnly
                value={json}
                rows={14}
                fontSize="xs"
                fontFamily="mono"
                bg="blackAlpha.700"
                color="white"
                onFocus={(event) => event.target.select()}
            />
        </Box>
    );
};

const WalletDebugPanel: FC = () => {
    const [enabled, setEnabled] = useState(isWalletDebugEnabled);
    if (!enabled) return null;
    return <WalletDebugOverlay onHide={() => setEnabled(false)} />;
};

export default WalletDebugPanel;
