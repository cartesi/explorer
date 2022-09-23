// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    cleanup,
    render,
    screen,
    act,
    fireEvent,
    waitFor,
} from '@testing-library/react';
import { useColorMode } from '@chakra-ui/react';
import Onboard, {
    ConnectOptions,
    InitOptions,
    OnboardAPI,
    WalletState,
} from '@web3-onboard/core';
import { ConnectOptionsString } from '@web3-onboard/core/dist/types';
import { useFlag, useUnleashContext } from '@unleash/proxy-client-react';
import { WalletConnectionProvider } from '../../../src/contexts/wallet';
import { emulateFor, TestComponent } from './helpers';
import { ReturnOf } from '../../test-utilities';
import { Network } from '../../../src/utils/networks';

jest.mock('@unleash/proxy-client-react', () => {
    const originalMod = jest.requireActual('@unleash/proxy-client-react');

    return {
        __esModule: true,
        ...originalMod,
        useFlag: jest.fn(),
        useUnleashContext: jest.fn(),
    };
});

jest.mock('@chakra-ui/react');
jest.mock('@web3-onboard/core');

const onboardStub = Onboard as jest.MockedFunction<typeof Onboard>;
const useFlagStub = useFlag as jest.MockedFunction<typeof useFlag>;
const useColorModeStub = useColorMode as jest.MockedFunction<
    typeof useColorMode
>;
const useUnleashContextStub = useUnleashContext as jest.MockedFunction<
    typeof useUnleashContext
>;

const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';

describe('Wallet Provider', () => {
    const Component = () => (
        <WalletConnectionProvider>
            <TestComponent />
        </WalletConnectionProvider>
    );

    let log: jest.SpyInstance;
    let info: jest.SpyInstance;
    const original = window.location;

    beforeAll(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: jest.fn() },
        });
    });

    afterAll(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: original,
        });
    });

    afterEach(() => {
        cleanup();
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('When wallet not connected', () => {
        it('Should be able to call wallet selection and when dismissed wallet-check is not called', () => {
            const walletSelectMock = jest;
            render(<Component />);
            fireEvent.click(screen.getByText('Connect Wallet'));

            expect(walletSelectMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('When wallet connected', () => {
        it('should be able to display wallet information and also log more information', async () => {
            render(<Component />);

            await screen.findByText('Wallet is not connected');

            expect(screen.getByText('Wallet is connected')).toBeInTheDocument();
            expect(
                screen.getByText('Ethers library is set')
            ).toBeInTheDocument();
            expect(screen.getByText('Disconnect Wallet')).toBeInTheDocument();
            expect(
                screen.getByText(`account is: ${account.toLowerCase()}`)
            ).toBeInTheDocument();
            expect(screen.getByText(`chainId is: 1`)).toBeInTheDocument();
            expect(
                screen.getByText('wallet name is: Metamask')
            ).toBeInTheDocument();

            const newLogs = log.mock.calls.slice(3);
            expect(newLogs).toEqual([
                ['Wallet selected: Metamask'],
                ['Network changed to: Ethereum Mainnet'],
                [
                    'Address changed to: 0x907eA0e65Ecf3af503007B382E1280Aeb46104ad',
                ],
                [
                    'Skipping the page reload since is not WalletConnect. The selected one is Metamask',
                ],
            ]);
        });

        it('should clean-up the local-storage and reset onboard state when disconnet the wallet', async () => {
            const removeItemSpy = jest.spyOn(
                global.Storage.prototype,
                'removeItem'
            );

            render(<Component />);

            await screen.findByText('Wallet is not connected');

            await waitFor(() => screen.findByText('Disconnect Wallet'));

            fireEvent.click(screen.getByText('Disconnect Wallet'));

            expect(removeItemSpy).toHaveBeenCalledWith('selectedWallet');
        });

        it('should call the location reload when using the wallet-connect and change the chain-id', async () => {
            render(<Component />);

            // When first time rendering with WalletConnect wallet
            expect(
                await screen.findByText('chainId is: 1')
            ).toBeInTheDocument();

            expect(info).toHaveBeenCalledWith(
                'Skipping reload because it was the first network change'
            );

            expect(
                await screen.findByText('chainId is: 5')
            ).toBeInTheDocument();
            expect(window.location.reload).toHaveBeenCalled();
        });
    });

    describe('Error Handling', () => {
        it('should set an Error when user tries to use an unsupported chain', async () => {
            render(<Component />);

            // When first time rendering with WalletConnect wallet
            expect(
                await screen.findByText('chainId is: 1')
            ).toBeInTheDocument();

            await waitFor(() => screen.findByText('Wallet is not connected'));

            expect(
                screen.getByText('Error: UnsupportedNetworkError')
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    'Network id 3 is not supported. Supported network ids are 1, 5, 31337'
                )
            );
        });
    });

    describe('Gnosis Safe', () => {
        it('Should have a way to recognize when the wallet is the gnosis safe', async () => {
            render(<Component />);

            expect(
                await screen.findByText('Wallet is Gnosis Safe')
            ).toBeInTheDocument();
            expect(
                await screen.findByText('wallet type is: sdk')
            ).toBeInTheDocument();
        });
    });
});
