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
import Onboard from 'bnc-onboard';
import { API, Subscriptions } from 'bnc-onboard/dist/src/interfaces';
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
jest.mock('bnc-onboard');

const APIStub: API = {
    accountSelect: jest.fn(),
    walletCheck: jest.fn(),
    walletSelect: jest.fn(),
    getState: jest.fn(),
    config: jest.fn(),
    walletReset: jest.fn(),
};
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

    beforeEach(() => {
        // default valid returns.
        useColorModeStub.mockReturnValue({
            colorMode: 'light',
            toggleColorMode: jest.fn(),
            setColorMode: jest.fn(),
        });
        useFlagStub.mockReturnValue(true);
        useUnleashContextStub.mockReturnValue(jest.fn());
        onboardStub.mockReturnValue(APIStub);
        jest.spyOn(APIStub, 'walletSelect').mockResolvedValue(false);
        jest.spyOn(APIStub, 'walletCheck').mockResolvedValue(false);
        // capture the params passed to the console.log() and avoid making the real log dirty.
        log = jest.spyOn(console, 'log').mockImplementation(() => null);
        info = jest.spyOn(console, 'info').mockImplementation(() => null);
    });

    afterEach(() => {
        cleanup();
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should bootstrap and with default values when the wallet is not set and log information', () => {
        render(<Component />);

        expect(screen.getByText('Wallet is not connected')).toBeInTheDocument();
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
        expect(log).toHaveBeenCalledTimes(3);
        expect(log.mock.calls).toEqual([
            ['Initializing onboarding.\nIs ankr enabled: true'],
            ['Onboard initialized.'],
            ['Setting up pre-selected wallet: no-wallet-selected previously'],
        ]);
    });

    it('should change the config when dark-mode is activated', async () => {
        const configMock = jest.spyOn(APIStub, 'config');
        const { rerender } = render(<Component />);
        act(() => {
            useColorModeStub.mockReturnValue({
                colorMode: 'dark',
                toggleColorMode: jest.fn(),
                setColorMode: jest.fn(),
            });
        });

        rerender(<Component />);

        await waitFor(() => configMock.mock.calls.length > 0);

        expect(configMock).toHaveBeenCalledWith({ darkMode: true });
    });

    it('should turn off dark-mode when back to light mode', async () => {
        const colorModeCtx: ReturnOf<typeof useColorMode> = {
            colorMode: 'dark',
            toggleColorMode: jest.fn(),
            setColorMode: jest.fn(),
        };
        useColorModeStub.mockReturnValue(colorModeCtx);
        const configMock = jest.spyOn(APIStub, 'config');
        const { rerender } = render(<Component />);

        act(() => {
            colorModeCtx.colorMode = 'light';
            useColorModeStub.mockReturnValue(colorModeCtx);
        });

        rerender(<Component />);

        await waitFor(() => configMock.mock.calls.length > 0);

        expect(configMock).toHaveBeenCalledWith({ darkMode: false });
    });

    describe('When wallet not connected', () => {
        it('Should be able to call wallet selection and when dismissed wallet-check is not called', () => {
            const walletSelectMock = jest
                .spyOn(APIStub, 'walletSelect')
                .mockResolvedValue(false);
            const walletCheckMock = jest.spyOn(APIStub, 'walletCheck');
            render(<Component />);
            fireEvent.click(screen.getByText('Connect Wallet'));

            expect(walletSelectMock).toHaveBeenCalledTimes(1);
            expect(walletCheckMock).not.toHaveBeenCalled();
        });

        it('Should call wallet-check when user selected a wallet', async () => {
            const walletSelectMock = jest
                .spyOn(APIStub, 'walletSelect')
                .mockResolvedValue(true);
            const walletCheckMock = jest
                .spyOn(APIStub, 'walletCheck')
                .mockResolvedValue(true);
            render(<Component />);

            fireEvent.click(screen.getByText('Connect Wallet'));

            await waitFor(() => walletCheckMock.mock.calls.length > 0);

            expect(walletSelectMock).toHaveBeenCalledTimes(1);
            expect(walletCheckMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('When wallet connected', () => {
        it('should be able to display wallet information and also log more information', async () => {
            let subs: Subscriptions = {};
            onboardStub.mockImplementation(({ subscriptions }) => {
                const { wallet, network, address } = subscriptions;
                subs = { wallet, network, address };
                return APIStub;
            });

            render(<Component />);

            await screen.findByText('Wallet is not connected');

            act(() => {
                emulateFor({ name: 'Metamask', account, subscriptions: subs });
            });

            expect(screen.getByText('Wallet is connected')).toBeInTheDocument();
            expect(
                screen.getByText('Ethers library is set')
            ).toBeInTheDocument();
            expect(screen.getByText('Disconnect Wallet')).toBeInTheDocument();
            expect(
                screen.getByText(`account is: ${account}`)
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
            let subs: Subscriptions = {};
            onboardStub.mockImplementation(({ subscriptions }) => {
                const { wallet, network, address } = subscriptions;
                subs = { wallet, network, address };
                return APIStub;
            });

            const removeItemSpy = jest.spyOn(
                global.Storage.prototype,
                'removeItem'
            );
            const walletResetSpy = jest.spyOn(APIStub, 'walletReset');

            render(<Component />);

            await screen.findByText('Wallet is not connected');

            act(() => {
                emulateFor({ name: 'Metamask', account, subscriptions: subs });
            });

            await waitFor(() => screen.findByText('Disconnect Wallet'));

            fireEvent.click(screen.getByText('Disconnect Wallet'));

            expect(removeItemSpy).toHaveBeenCalledWith('selectedWallet');
            expect(walletResetSpy).toHaveBeenCalledTimes(1);
        });

        it('should call the location reload when using the wallet-connect and change the chain-id', async () => {
            let subs: Subscriptions;
            onboardStub.mockImplementation(({ subscriptions }) => {
                const { wallet, network, address } = subscriptions;
                subs = { wallet, network, address };
                emulateFor({ name: 'WalletConnect', subscriptions, account });
                return APIStub;
            });

            render(<Component />);

            // When first time rendering with WalletConnect wallet
            expect(
                await screen.findByText('chainId is: 1')
            ).toBeInTheDocument();

            expect(info).toHaveBeenCalledWith(
                'Skipping reload because it was the first network change'
            );

            //Then after changing the network to Goerli
            act(() => {
                subs.network(Network.GOERLI);
            });

            expect(
                await screen.findByText('chainId is: 5')
            ).toBeInTheDocument();
            expect(window.location.reload).toHaveBeenCalled();
        });

        it('should call walletCheck and log information when user refuse to change the network', async () => {
            const getItemSpy = jest
                .spyOn(global.Storage.prototype, 'getItem')
                .mockReturnValue('Metamask');
            const selectMock = jest
                .spyOn(APIStub, 'walletSelect')
                .mockResolvedValue(true);
            const checkMock = jest
                .spyOn(APIStub, 'walletCheck')
                .mockResolvedValue(false);
            render(<Component />);

            await waitFor(() => checkMock.mock.calls.length > 0);

            expect(getItemSpy).toHaveBeenCalled();
            expect(selectMock).toHaveBeenCalled();
            expect(checkMock).toHaveBeenCalled();
            expect(log.mock.calls).toEqual([
                ['Initializing onboarding.\nIs ankr enabled: true'],
                ['Onboard initialized.'],
                ['Setting up pre-selected wallet: Metamask'],
                ['User rejected the request to switch to mainnet'],
            ]);
        });
    });

    describe('Error Handling', () => {
        it('should set an Error when user tries to use an unsupported chain', async () => {
            let subs: Subscriptions;
            onboardStub.mockImplementation(({ subscriptions }) => {
                const { wallet, network, address } = subscriptions;
                subs = { wallet, network, address };
                emulateFor({ name: 'Metamask', subscriptions, account });
                return APIStub;
            });

            render(<Component />);

            // When first time rendering with WalletConnect wallet
            expect(
                await screen.findByText('chainId is: 1')
            ).toBeInTheDocument();

            act(() => {
                // trying to use Ropsten
                subs.network(3);
            });

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
});
