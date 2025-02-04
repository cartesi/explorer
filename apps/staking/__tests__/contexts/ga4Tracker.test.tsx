// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { act, render, waitFor } from '@testing-library/react';
import ReactGA from 'react-ga4';
import { useWallet } from '../../src/components/wallet/useWallet';
import {
    CustomDimensions,
    GA4TrackerProvider,
    anonymizeUser,
    measurementID,
} from '../../src/contexts/ga4Tracker';
import { Network } from '../../src/utils/networks';

const walletMod = '../../src/components/wallet/useWallet';
jest.mock(walletMod, () => {
    const originalModule = jest.requireActual(walletMod);
    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

jest.mock('react-ga4');
const mockedInitialize = ReactGA.initialize as jest.MockedFunction<
    typeof ReactGA.initialize
>;
const mockedEvent = ReactGA.event as jest.MockedFunction<typeof ReactGA.event>;

const mockedSet = ReactGA.set as jest.MockedFunction<typeof ReactGA.set>;

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
const activate = jest.fn();
const deactivate = jest.fn();

const walletMock = {
    account,
    active: true,
    activate,
    deactivate,
    chainId: Network.MAINNET,
    walletName: 'Wallet ABC',
};

describe('ga4Tracker context', () => {
    const initialEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        mockUseWallet.mockReturnValue(walletMock);
        process.env = {
            NODE_ENV: 'production',
        };
    });

    afterAll(() => {
        process.env = initialEnv;
    });

    it('should anonymize user', () => {
        expect(anonymizeUser(account)).toBe(account.substring(2, 10));
    });

    it('should initialize ReactGA in production mode', async () => {
        const mockedImplementation = jest.fn();
        mockedInitialize.mockImplementation(mockedImplementation);
        render(<GA4TrackerProvider>Content</GA4TrackerProvider>);

        await waitFor(() => {
            expect(mockedImplementation).toHaveBeenCalledWith(measurementID, {
                gaOptions: {
                    name: 'explorer',
                    userId: account.substring(2, 10),
                },
            });
        });
    });

    it('should not initialize ReactGA in non-production mode', async () => {
        process.env = {
            NODE_ENV: 'development',
        };
        const mockedImplementation = jest.fn();
        mockedInitialize.mockImplementation(mockedImplementation);
        render(<GA4TrackerProvider>Content</GA4TrackerProvider>);

        await waitFor(() => {
            expect(mockedImplementation).toHaveBeenCalledTimes(0);
        });
    });

    it('should invoke GA event for wallet selection', async () => {
        process.env = {
            NODE_ENV: 'production',
        };
        const mockedImplementation = jest.fn();
        mockedEvent.mockImplementation(mockedImplementation);

        //Wallet is not connected
        mockUseWallet.mockReturnValue({ active: false, activate, deactivate });
        const { rerender } = render(
            <GA4TrackerProvider>Content</GA4TrackerProvider>
        );

        await act(() => {
            // Return wallet information and rerender
            mockUseWallet.mockReturnValue(walletMock);
            rerender(<GA4TrackerProvider>Content</GA4TrackerProvider>);
        });

        await waitFor(() => {
            expect(mockedImplementation).toHaveBeenCalledWith(
                'Wallet Selection',
                {
                    [CustomDimensions.WalletName]: walletMock.walletName,
                }
            );
        });
    });

    it('should invoke GA set function with user data', async () => {
        process.env = {
            NODE_ENV: 'production',
        };
        const mockedImplementation = jest.fn();
        mockedSet.mockImplementation(mockedImplementation);
        //Wallet is not connected
        mockUseWallet.mockReturnValue({ active: false, activate, deactivate });
        const { rerender } = render(
            <GA4TrackerProvider>Content</GA4TrackerProvider>
        );

        await act(() => {
            // Return wallet information and rerender
            mockUseWallet.mockReturnValue(walletMock);
            rerender(<GA4TrackerProvider>Content</GA4TrackerProvider>);
        });

        await waitFor(() => {
            expect(mockedImplementation).toHaveBeenCalledWith({
                userId: anonymizeUser(account),
            });
        });
    });
});
