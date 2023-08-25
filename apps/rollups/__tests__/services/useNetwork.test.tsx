// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Web3Provider } from '@ethersproject/providers';
import { useWallet } from '@explorer/wallet';
import { WalletConnectionContextProps } from '@explorer/wallet/src/definitions';
import { cleanup, renderHook } from '@testing-library/react';
import { useNetwork } from '../../src/services/useNetwork';

const walletMod = '@explorer/wallet';

jest.mock(walletMod, () => {
    const originalModule = jest.requireActual(walletMod);
    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

describe('useNetwork hook', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should set network to the wallet chainId when wallet exists', () => {
        const chainId = 11155111;
        mockUseWallet.mockReturnValue({
            library: {} as Web3Provider,
            chainId,
        } as WalletConnectionContextProps);

        const network = renderHook(() => useNetwork());
        expect(network.result.current.chain?.id).toBe(
            `0x${Number(chainId).toString(16)}`
        );
    });

    it("should set network to undefined when wallet doesn't exist", () => {
        mockUseWallet.mockReturnValue(undefined);

        const network = renderHook(() => useNetwork());
        expect(network.result.current).toBe(undefined);
    });
});
