// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

/**
 * The Coinbase Wallet in-app browser injects `window.ethereum` flagged with
 * `isCoinbaseBrowser`, which `@base-org/account` uses instead of its popup.
 * wagmi's `baseAccount` connector then trusts the first chain in the
 * `wallet_connect` reply (the one it asked for) rather than the wallet's own
 * chain, so wagmi records chain 1 while the wallet sits on Base (8453) and the
 * wallet client can never be built.
 */
import { mainnet, sepolia } from 'viem/chains';
import { ConnectorChainMismatchError, createConfig, http } from 'wagmi';
import { connect, disconnect, getWalletClient } from 'wagmi/actions';
import { baseAccount } from 'wagmi/connectors';
import {
    chains,
    local,
    supportedChainIds,
} from '../../../src/components/wallet/chains';

const address = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
const BASE_CHAIN_ID = 8453;
const BASE_CHAIN_HEX = '0x2105';

type Listener = (...args: unknown[]) => void;
interface Request {
    method: string;
    params?: any;
}

/** The provider Coinbase Wallet injects into its in-app browser. */
class FakeCoinbaseBrowserProvider {
    isCoinbaseBrowser = true;
    isCoinbaseWallet = true;
    chainId = BASE_CHAIN_HEX;
    rejectSwitch = false;
    requests: Request[] = [];
    private listeners = new Map<string, Set<Listener>>();

    async request({ method, params }: Request) {
        this.requests.push({ method, params });
        switch (method) {
            case 'wallet_connect':
                // Echoes the requested chains, so the first one is the chain
                // the dapp asked for, not the chain the wallet is on.
                return {
                    accounts: [{ address, capabilities: {} }],
                    chainIds: params[0].chainIds,
                };
            case 'eth_chainId':
                return this.chainId;
            case 'eth_accounts':
            case 'eth_requestAccounts':
                return [address];
            case 'wallet_switchEthereumChain': {
                if (this.rejectSwitch) {
                    throw Object.assign(
                        new Error('User rejected the request.'),
                        {
                            code: 4001,
                        },
                    );
                }
                this.chainId = params[0].chainId;
                this.emit('chainChanged', this.chainId);
                return null;
            }
            default:
                throw new Error(`unexpected request ${method}`);
        }
    }

    methods(): string[] {
        return this.requests.map((request) => request.method);
    }

    on(event: string, listener: Listener) {
        if (!this.listeners.has(event)) this.listeners.set(event, new Set());
        this.listeners.get(event)!.add(listener);
    }

    removeListener(event: string, listener: Listener) {
        this.listeners.get(event)?.delete(listener);
    }

    emit(event: string, ...args: unknown[]) {
        this.listeners.get(event)?.forEach((listener) => listener(...args));
    }

    disconnect() {}
}

const createTestConfig = () =>
    createConfig({
        chains,
        transports: {
            [mainnet.id]: http('http://127.0.0.1:1'),
            [sepolia.id]: http('http://127.0.0.1:1'),
            [local.id]: http('http://127.0.0.1:1'),
        },
        connectors: [
            baseAccount({ appName: 'test', preference: { telemetry: false } }),
        ],
        multiInjectedProviderDiscovery: false,
        storage: null,
        ssr: false,
    });

describe('Base Account connector inside the Coinbase in-app browser', () => {
    let provider: FakeCoinbaseBrowserProvider;
    let config: ReturnType<typeof createTestConfig>;

    beforeEach(() => {
        provider = new FakeCoinbaseBrowserProvider();
        window.ethereum = provider;
        config = createTestConfig();
    });

    afterEach(async () => {
        await disconnect(config).catch(() => undefined);
        delete (window as { ethereum?: unknown }).ethereum;
    });

    it('is a chain the explorer does not support', () => {
        expect(supportedChainIds).not.toContain(BASE_CHAIN_ID);
    });

    it('records the requested chain instead of the chain the wallet is on', async () => {
        const [connector] = config.connectors;

        const result = await connect(config, {
            connector,
            chainId: mainnet.id,
        });

        expect(result.chainId).toBe(mainnet.id);
        expect(await connector.getChainId()).toBe(BASE_CHAIN_ID);
        expect(config.state.status).toBe('connected');
        const walletConnect = provider.requests.find(
            (request) => request.method === 'wallet_connect',
        );
        expect(walletConnect?.params[0].chainIds[0]).toBe('0x1');
        expect(provider.methods()).not.toContain('wallet_switchEthereumChain');
    });

    it('cannot build a wallet client while still reporting connected', async () => {
        const [connector] = config.connectors;
        await connect(config, { connector, chainId: mainnet.id });

        await expect(getWalletClient(config)).rejects.toBeInstanceOf(
            ConnectorChainMismatchError,
        );
        await expect(getWalletClient(config)).rejects.toThrow(
            String(BASE_CHAIN_ID),
        );
        expect(config.state.status).toBe('connected');
    });

    it('reports the requested chain again when reconnecting on page load', async () => {
        const [connector] = config.connectors;

        const result = await connector.connect({ isReconnecting: true });

        expect(result.chainId).toBe(mainnet.id);
        expect(await connector.getChainId()).toBe(BASE_CHAIN_ID);
    });
});
