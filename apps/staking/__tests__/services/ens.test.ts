// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { renderHook, waitFor } from '@testing-library/react';
import { ethers } from 'ethers';
import { useWallet } from '@explorer/wallet/src/useWallet';
import { useENS } from '../../src/services/ens';
import { Web3Provider } from '@ethersproject/providers';
import { WalletConnectionContextProps } from '@explorer/wallet/src/definitions';

jest.mock('ethers');

jest.mock('@explorer/wallet/src/useWallet');

const address = '0x51937974a767da96dc1c3f9a7b07742e256f0ffe';
const mockedGetAddress = ethers.utils.getAddress as jest.MockedFunction<
    typeof ethers.utils.getAddress
>;
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

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

describe('ens service', () => {
    beforeEach(() => {
        mockUseWallet.mockReturnValue(
            walletData as unknown as WalletConnectionContextProps
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should early return address if an error has occurred', async () => {
        mockedGetAddress.mockImplementation(() => {
            throw new Error('Error ABC');
        });
        const { result } = renderHook(() => useENS(address));

        await waitFor(() => {
            expect(result.current.address).toBe(address);
            expect(result.current.resolving).toBe(false);
        });
    });

    it('should early return address if network does not support ENS', async () => {
        mockUseWallet.mockReturnValue({
            ...walletData,
            library: {
                ...walletData.library,
                network: {
                    ensAddress: undefined,
                },
            },
        } as unknown as WalletConnectionContextProps);

        const address = '0x07b41c2b437e69dd1523bf1cff5de63ad9bb3dc6';
        mockedGetAddress.mockImplementation(() => address);
        const { result } = renderHook(() => useENS(address));

        await waitFor(() => {
            expect(result.current.address).toBe(address);
            expect(result.current.resolving).toBe(false);
        });
    });

    it('should early return address if lookupAddress function returns an undefined name', async () => {
        mockUseWallet.mockReturnValue({
            ...walletData,
            library: {
                lookupAddress: () => Promise.resolve(undefined),
                network: {
                    ensAddress: 'some-ens-address',
                },
            },
        } as unknown as WalletConnectionContextProps);

        const address = '0x07b41c2b437e69dd1523bf1cff5de63ad9bb3dc6';
        mockedGetAddress.mockImplementation(() => address);
        const { result } = renderHook(() => useENS(address));

        await waitFor(() => {
            expect(result.current.address).toBe(address);
            expect(result.current.resolving).toBe(false);
        });
    });

    it('should return expected ens data when reverse and forward lookup are successful', async () => {
        const ensName = 'abc.xyz.com';
        const avatar = 'avatar-abc';
        const url = 'url-xyz';
        mockedGetAddress.mockImplementation(() => address);
        mockUseWallet.mockReturnValue({
            ...walletData,
            library: {
                network: {
                    ensAddress: 'some-ens-address',
                },
                lookupAddress: () => Promise.resolve(ensName),
                getResolver: () =>
                    Promise.resolve({
                        getAddress: () => Promise.resolve(address),
                        getText: (type) => {
                            if (type === 'avatar') {
                                return Promise.resolve(avatar);
                            }

                            return Promise.resolve(url);
                        },
                    }),
            },
        } as unknown as WalletConnectionContextProps);

        const { result } = renderHook(() => useENS(address));

        await waitFor(() => {
            expect(result.current.address).toBe(address);
            expect(result.current.name).toBe(ensName);
            expect(result.current.avatar).toBe(avatar);
            expect(result.current.url).toBe(url);
            expect(result.current.resolving).toBe(false);
        });
    });
});
