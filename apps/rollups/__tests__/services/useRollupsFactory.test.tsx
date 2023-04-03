// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    renderHook,
    cleanup,
    waitFor,
    screen,
    act,
} from '@testing-library/react';
import { useWallet } from '@explorer/wallet';
import { CartesiDAppFactory__factory } from '@cartesi/rollups';
import { useNetwork } from '../../src/services/useNetwork';
import { useRollupsFactory } from '../../src/services/useRollupsFactory';
import { networks } from '../../src/services/useNetwork';
import { JsonRpcSigner } from '@ethersproject/providers/src.ts/json-rpc-provider';
import { Provider, Web3Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { CartesiDAppFactory } from '@cartesi/rollups/dist/src/types/contracts/CartesiDAppFactory';

const walletMod = '@explorer/wallet';
const networkMod = '../../src/services/useNetwork';
const rollupsMod = '@cartesi/rollups';

jest.mock(walletMod, () => {
    const originalModule = jest.requireActual(walletMod);
    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

jest.mock(networkMod, () => {
    const originalModule = jest.requireActual(networkMod);
    return {
        __esModule: true,
        ...originalModule,
        useNetwork: jest.fn(),
    };
});

jest.mock(rollupsMod, () => {
    const originalModule = jest.requireActual(rollupsMod);
    return {
        __esModule: true,
        ...originalModule,
        connect: jest.fn(),
    };
});

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;
const mockUseNetwork = useNetwork as jest.MockedFunction<typeof useNetwork>;
const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
const defaultUseWalletData = {
    account,
    active: true,
    activate: jest.fn(),
    deactivate: jest.fn(),
    chainId: 3,
};

const defaultNetwork = networks[0x5];

describe('useRollupsFactory hook', () => {
    beforeEach(() => {
        mockUseWallet.mockReturnValue(defaultUseWalletData);
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("should set factory to undefined when network doesn't exist", () => {
        mockUseNetwork.mockReturnValue(undefined);

        const factory = renderHook(() => useRollupsFactory());
        expect(factory.result.current).toBe(undefined);
    });

    it("should set factory to undefined when wallet doesn't exist", () => {
        mockUseNetwork.mockReturnValue(defaultNetwork);
        mockUseWallet.mockReturnValue(undefined);

        const factory = renderHook(() => useRollupsFactory());
        expect(factory.result.current).toBe(undefined);
    });

    it('should ***', async () => {
        const connectValue = 'connect';
        CartesiDAppFactory__factory.connect = (): CartesiDAppFactory =>
            connectValue as unknown as CartesiDAppFactory;

        let isDeploymentCalled = false;
        mockUseNetwork.mockReturnValue({
            ...defaultNetwork,
            deployment: () => {
                isDeploymentCalled = true;
                return Promise.resolve({
                    address: account,
                    transaction: null,
                    receipt: null,
                    transactionHash: null,
                });
            },
        });
        mockUseWallet.mockReturnValue({
            ...defaultUseWalletData,
            library: {
                getSigner: (): JsonRpcSigner =>
                    'signer' as unknown as JsonRpcSigner,
            } as Web3Provider,
        });

        await waitFor(() => {
            renderHook(() => useRollupsFactory());
        });

        expect(isDeploymentCalled).toBe(true);
    });
});
