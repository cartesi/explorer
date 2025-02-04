// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { fireEvent, render, screen } from '@testing-library/react';
import { useUnleashContext } from '@unleash/proxy-client-react';
import { WalletConnectionProvider } from '../../../src/components/wallet/provider';
import { useOnboard } from '../../../src/components/wallet/useOnboard';
import { useWallet } from '../../../src/components/wallet/useWallet';
import { Network, networks } from '../../../src/utils/networks';
import { TestComponent } from './helpers';
import { buildMockUseOnboardV2Return } from './mocks';

const walletMod = '../../../src/components/wallet/useWallet';

jest.mock(walletMod, () => {
    const originalModule = jest.requireActual(walletMod);
    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

jest.mock('@unleash/proxy-client-react', () => {
    const originalMod = jest.requireActual('@unleash/proxy-client-react');

    return {
        __esModule: true,
        ...originalMod,
        useFlag: jest.fn(),
        useUnleashContext: jest.fn(),
    };
});

jest.mock('../../../src/components/wallet/useOnboard');
jest.mock('@chakra-ui/react');

const useOnboardStub = useOnboard as jest.MockedFunction<typeof useOnboard>;
const useUnleashContextStub = useUnleashContext as jest.MockedFunction<
    typeof useUnleashContext
>;
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
const walletMock = {
    account,
    active: true,
    activate: jest.fn(),
    deactivate: jest.fn(),
    chainId: Network.MAINNET,
};

const chainIds = Object.keys(networks).map(
    (key) => `0x${Number(key).toString(16)}`
);

describe('Wallet Provider', () => {
    const Component = () => (
        <WalletConnectionProvider chainIds={chainIds}>
            <TestComponent />
        </WalletConnectionProvider>
    );

    beforeEach(() => {
        useOnboardStub.mockReturnValue(buildMockUseOnboardV2Return());
        useUnleashContextStub.mockReturnValue(jest.fn());
        mockUseWallet.mockReturnValue(walletMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should display correct texts when wallet is not connected', () => {
        mockUseWallet.mockReturnValue({
            ...walletMock,
            active: false,
        });
        render(<Component />);

        expect(screen.getByText('Wallet is not connected')).toBeInTheDocument();
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('should display correct texts when wallet is connected', () => {
        const chainId = 1;
        mockUseWallet.mockReturnValue({
            ...walletMock,
            chainId,
        });

        render(<Component />);

        expect(screen.getByText('Wallet is connected')).toBeInTheDocument();
        expect(screen.getByText('Disconnect Wallet')).toBeInTheDocument();
        expect(screen.getByText(`chainId is: ${chainId}`)).toBeInTheDocument();
    });

    it('Should be able to invoke "activate" function when wallet is not connected', () => {
        mockUseWallet.mockReturnValue({
            ...walletMock,
            active: false,
        });
        const walletSelectMock = jest.spyOn(walletMock, 'activate');

        render(<Component />);
        fireEvent.click(screen.getByText('Connect Wallet'));

        expect(walletSelectMock).toHaveBeenCalledTimes(1);
    });

    it('Should be able to invoke "deactivate" function when wallet is connected', () => {
        const walletDeactivateMock = jest.spyOn(walletMock, 'deactivate');

        render(<Component />);
        fireEvent.click(screen.getByText('Disconnect Wallet'));

        expect(walletDeactivateMock).toHaveBeenCalledTimes(1);
    });

    it('Should have a way to recognize when the wallet is the gnosis safe', async () => {
        const walletType = 'sdk';
        mockUseWallet.mockReturnValue({
            ...walletMock,
            isGnosisSafe: true,
            walletType,
        });

        render(<Component />);

        expect(
            await screen.findByText('Wallet is Gnosis Safe')
        ).toBeInTheDocument();
        expect(
            await screen.findByText(`wallet type is: ${walletType}`)
        ).toBeInTheDocument();
    });
});
