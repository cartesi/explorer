// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { useWallet } from '@explorer/wallet';
import { useRollups } from '../../src/services/useRollups';
import { Web3Provider } from '@ethersproject/providers';
import { WalletConnectionContextProps } from '@explorer/wallet/src/definitions';

const walletMod = '@explorer/wallet';
const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';

jest.mock(walletMod, () => {
    const originalModule = jest.requireActual(walletMod);
    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

const networkMod = '../../src/services/useNetwork';
const rollupsMod = '../../src/services/useRollupsFactory';

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
        useRollupsFactory: jest.fn(),
    };
});

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

describe('useRollups hook', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("should set correct rollups state when wallet library doesn't exist", () => {
        const chainId = 5;
        mockUseWallet.mockReturnValue({
            library: undefined,
            chainId,
        } as WalletConnectionContextProps);

        const rollups = renderHook(() => useRollups(account));
        expect(rollups.result.current).toBe(undefined);
    });

    it('should call library.getSigner when attempting to connect', async () => {
        const chainId = 5;
        const mockedGetSigner = jest.fn();
        mockUseWallet.mockReturnValue({
            library: {
                getSigner: mockedGetSigner,
            } as unknown as Web3Provider,
            chainId,
        } as WalletConnectionContextProps);

        await waitFor(() => {
            renderHook(() => useRollups(account));
        });

        expect(mockedGetSigner).toBeCalled();
    });
});
