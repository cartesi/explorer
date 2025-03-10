// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { isAddress } from '@ethersproject/address';
import { Web3Provider } from '@ethersproject/providers';
import { renderHook, waitFor } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { WalletConnectionContextProps } from '../../src/components/wallet/definitions';
import { useWallet } from '../../src/components/wallet/useWallet';
import { useBalance, useBlockNumber } from '../../src/services/eth';

jest.mock('../../src/components/wallet/useWallet');
jest.mock('@ethersproject/address', () => {
    const originalModule = jest.requireActual('@ethersproject/address');
    return {
        __esModule: true,
        ...originalModule,
        isAddress: jest.fn(),
    };
});

const address = '0x51937974a767da96dc1c3f9a7b07742e256f0ffe';
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;
const mockedIsAddress = isAddress as jest.MockedFunction<typeof isAddress>;

const walletData = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    library: {
        getSigner: jest.fn(),
    } as unknown as Web3Provider,
    account: address,
    active: true,
    activate: jest.fn(),
    deactivate: jest.fn(),
    chainId: 3,
    network: {
        ensAddress: '0xb00299b573a9deee20e6a242416188d1033e325f',
    },
};

describe('eth service', () => {
    beforeEach(() => {
        mockUseWallet.mockReturnValue(
            walletData as unknown as WalletConnectionContextProps
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('useBalance hook', () => {
        it('should return undefined balance if library is not defined', async () => {
            mockUseWallet.mockReturnValue({
                ...walletData,
                library: undefined,
            } as unknown as WalletConnectionContextProps);
            const { result } = renderHook(() => useBalance(address));

            await waitFor(() => {
                expect(result.current).toBe(undefined);
            });
        });

        it('should return undefined balance if address is not valid', async () => {
            mockUseWallet.mockReturnValue(
                walletData as unknown as WalletConnectionContextProps
            );
            mockedIsAddress.mockReturnValue(false);
            const { result } = renderHook(() => useBalance(address));

            await waitFor(() => {
                expect(result.current).toBe(undefined);
            });
        });

        it('should return correct balance if address is valid', async () => {
            const balance = BigNumber.from('10000000000');
            mockUseWallet.mockReturnValue({
                ...walletData,
                library: {
                    ...walletData.library,
                    getBalance: () => Promise.resolve(balance),
                },
            } as unknown as WalletConnectionContextProps);

            mockedIsAddress.mockReturnValue(true);
            const { result } = renderHook(() => useBalance(address));

            await waitFor(() => {
                expect(result.current).toStrictEqual(balance);
            });
        });
    });

    describe('useBlockNumber hook', () => {
        it('should return zero block number if library is not defined', async () => {
            mockUseWallet.mockReturnValue({
                ...walletData,
                library: undefined,
            } as unknown as WalletConnectionContextProps);
            const { result } = renderHook(() => useBlockNumber());

            await waitFor(() => {
                expect(result.current).toBe(0);
            });
        });

        it('should return correct block number if library is defined', async () => {
            const blockNumber = 10;
            mockUseWallet.mockReturnValue({
                ...walletData,
                library: {
                    ...walletData.library,
                    getBlockNumber: () => Promise.resolve(blockNumber),
                    on: jest.fn(),
                    removeListener: jest.fn(),
                },
            } as unknown as WalletConnectionContextProps);
            const { result } = renderHook(() => useBlockNumber());

            await waitFor(() => {
                expect(result.current).toStrictEqual(blockNumber);
            });
        });
    });
});
