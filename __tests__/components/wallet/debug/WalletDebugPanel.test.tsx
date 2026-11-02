// Copyright (C) 2026 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useAccount, useChainId, useConfig, useSwitchChain } from 'wagmi';
import WalletDebugPanel from '../../../../src/components/wallet/debug/WalletDebugPanel';
import {
    WALLET_DEBUG_MINIMIZED_KEY,
    WALLET_DEBUG_STORAGE_KEY,
} from '../../../../src/components/wallet/debug/walletDebugFlag';
import { useWallet } from '../../../../src/components/wallet/useWallet';
import { withChakraTheme } from '../../../test-utilities';

jest.mock('wagmi', () => ({
    useAccount: jest.fn(),
    useChainId: jest.fn(),
    useConfig: jest.fn(),
    useSwitchChain: jest.fn(),
}));

jest.mock('@rainbow-me/rainbowkit', () => ({
    useConnectModal: jest.fn(),
}));

jest.mock('../../../../src/components/wallet/useWallet', () => ({
    useWallet: jest.fn(),
}));

const Panel = withChakraTheme(WalletDebugPanel);
const address = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
const connector = {
    id: 'baseAccount',
    name: 'Base Account',
    type: 'baseAccount',
    getChainId: jest.fn().mockResolvedValue(8453),
};
const mismatch = Object.assign(new Error('chain 8453 vs 1'), {
    name: 'ConnectorChainMismatchError',
});
const switchChainAsync = jest.fn();

const readSnapshot = () =>
    JSON.parse(
        (screen.getByRole('textbox') as HTMLTextAreaElement).value || '{}',
    );
const waitForProbes = () =>
    waitFor(() => expect(readSnapshot().probes.connectorChainId).toBe('8453'));

describe('WalletDebugPanel', () => {
    beforeEach(() => {
        window.localStorage.setItem(WALLET_DEBUG_STORAGE_KEY, '1');
        window.ethereum = {
            isCoinbaseWallet: true,
            isCoinbaseBrowser: true,
            request: jest.fn().mockResolvedValue('0x2105'),
        };
        (useAccount as jest.Mock).mockReturnValue({
            status: 'connected',
            address,
            chainId: 1,
            connector,
        });
        (useChainId as jest.Mock).mockReturnValue(1);
        (useConfig as jest.Mock).mockReturnValue({
            connectors: [{ id: 'metaMaskSDK' }, { id: 'baseAccount' }],
        });
        (useSwitchChain as jest.Mock).mockReturnValue({ switchChainAsync });
        (useConnectModal as jest.Mock).mockReturnValue({
            openConnectModal: undefined,
            connectModalOpen: false,
        });
        (useWallet as jest.Mock).mockReturnValue({
            active: false,
            walletClientError: mismatch,
        });
        switchChainAsync.mockResolvedValue({ id: 11155111 });
    });

    afterEach(() => {
        window.localStorage.clear();
        delete (window as { ethereum?: unknown }).ethereum;
        jest.clearAllMocks();
    });

    it('renders nothing unless the flag is set', () => {
        window.localStorage.clear();

        const { container } = render(<Panel />);

        expect(container).toBeEmptyDOMElement();
    });

    it('shows a snapshot that tells the recorded chain from the wallet chain', async () => {
        render(<Panel />);

        await waitForProbes();
        expect(readSnapshot()).toMatchObject({
            app: {
                active: false,
                walletClientError: expect.stringContaining(
                    'ConnectorChainMismatchError',
                ),
            },
            wagmi: {
                status: 'connected',
                chainId: 1,
                configChainId: 1,
                connector: { id: 'baseAccount' },
                connectorIds: ['metaMaskSDK', 'baseAccount'],
            },
            probes: { connectorChainId: '8453', injectedChainId: '0x2105' },
            rainbowKit: { openConnectModalDefined: false },
            injected: { present: true, isCoinbaseBrowser: true },
        });
    });

    it('asks the wallet to switch to Sepolia and reports the answer', async () => {
        render(<Panel />);

        fireEvent.click(screen.getByText('Switch to Sepolia'));

        expect(switchChainAsync).toHaveBeenCalledWith({ chainId: 11155111 });
        await waitFor(() =>
            expect(readSnapshot().switchResult).toBe('switched to 11155111'),
        );
    });

    it('reports a refused switch', async () => {
        switchChainAsync.mockRejectedValue(
            Object.assign(new Error('User rejected'), { code: 4001 }),
        );
        render(<Panel />);

        fireEvent.click(screen.getByText('Switch to Mainnet'));

        await waitFor(() =>
            expect(readSnapshot().switchResult).toBe(
                'switch to 1 failed: Error: User rejected (code 4001)',
            ),
        );
    });

    it('copies the snapshot to the clipboard', async () => {
        const writeText = jest.fn().mockResolvedValue(undefined);
        Object.assign(navigator, { clipboard: { writeText } });
        render(<Panel />);
        await waitForProbes();

        fireEvent.click(screen.getByText('Copy JSON'));

        expect(writeText).toHaveBeenCalledWith(
            expect.stringContaining('"connectorChainId": "8453"'),
        );
        await screen.findByText('copied');
    });

    it('minimizes to a pill that brings it back', async () => {
        render(<Panel />);
        await waitForProbes();

        fireEvent.click(screen.getByText('Minimize'));
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId('wallet-debug-pill'));
        expect(readSnapshot().probes.connectorChainId).toBe('8453');
    });

    it('starts minimized when it was left that way', () => {
        window.localStorage.setItem(WALLET_DEBUG_MINIMIZED_KEY, '1');

        render(<Panel />);

        expect(screen.getByTestId('wallet-debug-pill')).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('hides itself and forgets the flag', () => {
        const { container } = render(<Panel />);

        fireEvent.click(screen.getByText('Hide'));

        expect(container).toBeEmptyDOMElement();
        expect(
            window.localStorage.getItem(WALLET_DEBUG_STORAGE_KEY),
        ).toBeNull();
    });
});
