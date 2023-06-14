// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { renderHook, waitFor, cleanup } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import {
    buildConfig,
    checkNetwork,
    convertToHex,
    getWalletType,
    handlerBuilder,
    useOnboard,
} from '../src/useOnboard';
import { Network, networks } from '@explorer/utils';
import { UnsupportedNetworkError } from '../src';
import { WalletType } from '../src/definitions';
import Onboard, {
    EIP1193Provider,
    OnboardAPI,
    WalletState,
} from '@web3-onboard/core';
import { ConnectedChain } from '@web3-onboard/core/dist/types';

jest.mock('ethers');

jest.mock('@unleash/proxy-client-react', () => ({
    useUnleashContext: () => jest.fn(),
    useFlag: jest.fn(),
}));

jest.mock('@web3-onboard/core', () => {
    const originalModule = jest.requireActual('@web3-onboard/core');
    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(),
    };
});

const defaultChainIds = Object.keys(networks).map(
    (key) => `0x${Number(key).toString(16)}`
);
const defaultAppMetadata: Record<string, string> = {
    name: 'Cartesi Explorer App',
    description: 'A place where you can stake CTSI and much more...',
};

const chain = {
    id: `0x${convertToHex(Network.GOERLI)}`,
    namespace: 'ETH',
} as unknown as ConnectedChain;

const account = {
    address: '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad',
    ens: null,
    balance: null,
};

const wallet = {
    provider: 'Some provider' as unknown as EIP1193Provider,
    label: 'ledger',
    chains: [chain],
    accounts: [account],
} as WalletState;

const mockedOnboard = Onboard as jest.MockedFunction<typeof Onboard>;

describe('useOnBoard', () => {
    const initialEnv = process.env;

    afterAll(() => {
        process.env = initialEnv;
    });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('should build config with correct chains', () => {
        const chainIds = Object.keys(networks)
            .slice(0, 2)
            .map((key) => `0x${Number(key).toString(16)}`);
        const config = buildConfig(false, chainIds);

        expect(config.chains.length).toBe(chainIds.length);
        config.chains.forEach((chain) => {
            expect(chainIds.includes(chain.id.toString(16))).toBe(true);
        });
    });

    it('should build config with correct appMetadata', () => {
        const config = buildConfig(false, defaultChainIds, defaultAppMetadata);

        expect(config.appMetadata?.name).toBe(defaultAppMetadata.name);
        Object.keys(defaultAppMetadata).forEach((appMetadataKey) => {
            expect(
                (config.appMetadata as unknown as Record<string, string>)?.[
                    appMetadataKey
                ]
            ).toBe(defaultAppMetadata[appMetadataKey]);
        });
    });

    it('should build config with correct accountCenter', () => {
        const config = buildConfig(false, defaultChainIds, defaultAppMetadata);

        expect(config.accountCenter?.desktop.enabled).toBe(false);
        expect(config.accountCenter?.mobile.enabled).toBe(false);
    });

    it('should build config with correct number of wallets', () => {
        const config = buildConfig(false, defaultChainIds, defaultAppMetadata);
        expect(config.wallets.length).toBe(5);
    });

    it('should generate error when unsupported network is selected', () => {
        const [firstNetwork] = Object.keys(networks).map(Number);
        const chainIds = Object.keys(networks).slice(1, 3).map(Number);
        const error = checkNetwork(firstNetwork, chainIds);

        expect(error instanceof UnsupportedNetworkError).toBe(true);
    });

    it('should not generate error when supported network is selected', () => {
        const [firstNetwork] = Object.keys(networks).map(Number);
        const chainIds = Object.keys(networks).slice(0, 2).map(Number);
        const error = checkNetwork(firstNetwork, chainIds);

        expect(error).toBe(null);
    });

    it('should correctly convert number to hex string', () => {
        const prefix = '0x';
        expect(`${prefix}${convertToHex(Network.MAINNET)}`).toBe(`${prefix}1`);
    });

    it('should get correct wallet type', () => {
        const injectedWallets = new Set(['metamask', 'coinbase']);
        for (const value of injectedWallets) {
            expect(getWalletType(value)).toBe(WalletType.INJECTED);
        }

        const hardwareWallets = new Set(['ledger']);
        for (const value of hardwareWallets) {
            expect(getWalletType(value)).toBe(WalletType.HARDWARE);
        }

        const sdkWallets = new Set(['gnosis safe', 'safe']);
        for (const value of sdkWallets) {
            expect(getWalletType(value)).toBe(WalletType.SDK);
        }
    });

    it('should correctly check if network is supported', () => {
        const chainIdsAsNumbers = defaultChainIds.map((id) => parseInt(id, 16));
        const chainId = parseInt(defaultChainIds[0]);

        expect(checkNetwork(chainId, chainIdsAsNumbers)).toBe(null);

        expect(
            checkNetwork(10, chainIdsAsNumbers)
                ?.toString()
                .includes('UnsupportedNetworkError')
        ).toBe(true);
    });

    it('should correctly build state when wallets are defined', () => {
        let expectedState = null;
        const callback = (state: any) => {
            expectedState = state();
            return undefined;
        };
        const handler = handlerBuilder(callback, defaultChainIds);
        const wallets: WalletState[] = [wallet];

        handler(wallets);
        expect(expectedState).toStrictEqual({
            error: null,
            account: account.address?.toLowerCase(),
            chainId: parseInt(chain.id),
            isHardwareWallet: true,
            isGnosisSafe: false,
            walletType: WalletType.HARDWARE,
            walletLabel: wallet.label,
        });
    });

    it('should correctly build state when wallets are undefined', () => {
        let expectedState = null;
        const callback = (state: any) => {
            expectedState = state();
            return undefined;
        };
        const handler = handlerBuilder(callback, defaultChainIds);

        handler([]);
        expect(expectedState).toStrictEqual({});
    });

    it('should subscribe wallets after setting valid onboard', async () => {
        const wallets: WalletState[] = [wallet];
        let isSubscribed = false;
        const onboard = {
            connectWallet: () => Promise.resolve(wallets),
            disconnectWallet: () => Promise.resolve(wallets),
            setChain: jest.fn(),
            state: {
                get: () => ({
                    wallets,
                }),
                select: (type: any) => {
                    if (type === 'wallets') {
                        return {
                            subscribe: () => {
                                isSubscribed = true;
                                return {
                                    unsubscribe: jest.fn(),
                                };
                            },
                        };
                    }
                },
            },
        } as unknown as OnboardAPI;
        mockedOnboard.mockReturnValue(onboard);

        renderHook(() =>
            useOnboard({
                chainIds: defaultChainIds,
                appMetaData: defaultAppMetadata,
            })
        );

        await waitFor(() => {
            expect(isSubscribed).toBe(true);
        });
    });

    it('should correctly disconnect wallet', async () => {
        const wallets: WalletState[] = [wallet];
        let isDisconnectWalletCalled = false;
        const onboard = {
            connectWallet: () => Promise.resolve(wallets),
            disconnectWallet: () => {
                isDisconnectWalletCalled = true;
                return Promise.resolve(wallets);
            },
            setChain: jest.fn(),
            state: {
                get: () => ({
                    wallets,
                }),
                select: (type: any) => {
                    if (type === 'wallets') {
                        return {
                            subscribe: () => ({
                                unsubscribe: jest.fn(),
                            }),
                        };
                    }
                },
            },
        } as unknown as OnboardAPI;
        mockedOnboard.mockReturnValue(onboard);

        const { result } = renderHook(() =>
            useOnboard({
                chainIds: defaultChainIds,
                appMetaData: defaultAppMetadata,
            })
        );

        await act(async () => {
            await result.current.disconnectWallet();
        });

        await waitFor(() => {
            expect(isDisconnectWalletCalled).toBe(true);
        });
    });

    it('should correctly connect wallet', async () => {
        const wallets: WalletState[] = [wallet];
        let isConnectWalledCalled = false;
        const onboard = {
            connectWallet: () => {
                isConnectWalledCalled = true;
                return Promise.resolve(wallets);
            },
            disconnectWallet: () => Promise.resolve(wallets),
            setChain: jest.fn(),
            state: {
                get: () => ({
                    wallets,
                }),
                select: (type: any) => {
                    if (type === 'wallets') {
                        return {
                            subscribe: () => ({
                                unsubscribe: jest.fn(),
                            }),
                        };
                    }
                },
            },
        } as unknown as OnboardAPI;
        mockedOnboard.mockReturnValue(onboard);

        const { result } = renderHook(() =>
            useOnboard({
                chainIds: defaultChainIds,
                appMetaData: defaultAppMetadata,
            })
        );

        await act(async () => {
            await result.current.connectWallet();
        });

        await waitFor(() => {
            expect(isConnectWalledCalled).toBe(true);
        });
    });

    it('should correctly set chain to MainNet', async () => {
        process.env = {
            NODE_ENV: 'production',
        };

        const wallets: WalletState[] = [wallet];
        const mockedSetChain = jest.fn();
        const onboard = {
            connectWallet: () => Promise.resolve(wallets),
            disconnectWallet: () => Promise.resolve(wallets),
            setChain: mockedSetChain,
            state: {
                get: () => ({
                    wallets,
                }),
                select: (type: any) => {
                    if (type === 'wallets') {
                        return {
                            subscribe: () => ({
                                unsubscribe: jest.fn(),
                            }),
                        };
                    }
                },
            },
        } as unknown as OnboardAPI;
        mockedOnboard.mockReturnValue(onboard);

        const { result } = renderHook(() =>
            useOnboard({
                chainIds: defaultChainIds,
                appMetaData: defaultAppMetadata,
            })
        );

        await act(async () => {
            await result.current.connectWallet();
        });

        await waitFor(() => {
            expect(mockedSetChain).toHaveBeenCalledWith({
                chainId: `0x${convertToHex(Network.MAINNET)}`,
            });
        });
    });
});
