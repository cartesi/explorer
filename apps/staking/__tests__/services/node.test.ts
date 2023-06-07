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
import { isAddress } from '@ethersproject/address';
import { useBalance, useBlockNumber } from '../../src/services/eth';
import { Web3Provider } from '@ethersproject/providers';
import { useWorkerManagerContract } from '../../src/services/contracts';
import { WalletConnectionContextProps } from '@explorer/wallet/src/definitions';
import { usePoSContract, usePoS1Contract } from '../../src/services/contracts';
import { Transaction, useTransaction } from '../../src/services/transaction';
import { WorkerManagerAuthManagerImpl } from '@cartesi/util';
import { PoS } from '@cartesi/pos';
import { PoS as PoS1 } from '@cartesi/pos-1.0';
import { useNode } from '../../src/services/node';
import { act } from 'react-dom/test-utils';
import { BigNumber } from 'ethers';

jest.mock('@explorer/wallet');
jest.mock('@ethersproject/address', () => {
    const originalModule = jest.requireActual('@ethersproject/address');
    return {
        __esModule: true,
        ...originalModule,
        isAddress: jest.fn(),
    };
});

jest.mock('../../src/services/contracts', () => ({
    useWorkerManagerContract: jest.fn(),
    usePoSContract: jest.fn(),
    usePoS1Contract: jest.fn(),
}));

jest.mock('../../src/services/transaction', () => ({
    useTransaction: jest.fn(),
}));

jest.mock('../../src/services/eth', () => ({
    useBlockNumber: jest.fn(),
}));

jest.mock('../../src/services/eth', () => {
    const originalModule = jest.requireActual('../../src/services/eth');
    return {
        __esModule: true,
        ...originalModule,
        useBalance: jest.fn(),
    };
});

const address = '0x51937974a767da96dc1c3f9a7b07742e256f0ffe';
const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;
const mockedIsAddress = isAddress as jest.MockedFunction<typeof isAddress>;
const mockedUseTransaction = useTransaction as jest.MockedFunction<
    typeof useTransaction
>;
const mockedUseWorkerManagerContract =
    useWorkerManagerContract as jest.MockedFunction<
        typeof useWorkerManagerContract
    >;
const mockedUsePoSContract = usePoSContract as jest.MockedFunction<
    typeof usePoSContract
>;
const mockedUsePoS1Contract = usePoS1Contract as jest.MockedFunction<
    typeof usePoS1Contract
>;

const mockedUseBalance = useBalance as jest.MockedFunction<typeof useBalance>;

const walletData = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    library: {
        getSigner: jest.fn(),
        getBlockNumber: () => Promise.resolve(),
        on: jest.fn(),
        removeListener: jest.fn(),
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

const workerManager = {
    getUser: () => Promise.resolve(),
    isAvailable: () => Promise.resolve(),
    isPending: () => Promise.resolve(),
    isOwned: () => Promise.resolve(),
    isRetired: () => Promise.resolve(),
    isAuthorized: () => Promise.resolve(),
    authorize: jest.fn(),
    hireAndAuthorize: jest.fn(),
    cancelHire: jest.fn(),
    retire: jest.fn(),
};

const pos = {
    address,
};

const pos1 = {
    address,
};

describe('node service', () => {
    beforeEach(() => {
        mockedIsAddress.mockReturnValue(true);
        mockUseWallet.mockReturnValue(
            walletData as unknown as WalletConnectionContextProps
        );
        mockedUseWorkerManagerContract.mockReturnValue(
            workerManager as unknown as WorkerManagerAuthManagerImpl
        );
        mockedUseTransaction.mockReturnValue({
            set: jest.fn(),
        } as unknown as Transaction<any>);
        mockedUsePoSContract.mockReturnValue(pos as PoS);
        mockedUsePoS1Contract.mockReturnValue(pos1 as PoS1);
        mockedUseBalance.mockReturnValue(BigNumber.from('10000'));
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    describe('useNode hook', () => {
        it('should trigger transfer function', async () => {
            const mockedSendTransaction = jest.fn();
            mockUseWallet.mockReturnValue({
                ...walletData,
                library: {
                    ...walletData.library,
                    getSigner: () => ({
                        sendTransaction: mockedSendTransaction,
                    }),
                } as unknown as Web3Provider,
            } as unknown as WalletConnectionContextProps);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() => useNode(address));

            await act(async () => {
                result.current.transfer(1000);
            });

            expect(mockedSendTransaction).toHaveBeenCalled();
            expect(mockedSet).toHaveBeenCalled();
        });

        it('should trigger retire function', async () => {
            const mockedRetire = jest.fn();
            mockedUseWorkerManagerContract.mockReturnValue({
                ...walletData,
                retire: mockedRetire,
            } as unknown as WorkerManagerAuthManagerImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() => useNode(address));

            await act(async () => {
                result.current.retire();
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedRetire).toHaveBeenCalled();
        });

        it('should trigger cancelHire function', async () => {
            const mockedCancelHire = jest.fn();
            mockedUseWorkerManagerContract.mockReturnValue({
                ...walletData,
                cancelHire: mockedCancelHire,
            } as unknown as WorkerManagerAuthManagerImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() => useNode(address));

            await act(async () => {
                result.current.cancelHire();
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedCancelHire).toHaveBeenCalled();
        });

        it('should trigger hire function', async () => {
            const mockedHireAndAuthorize = jest.fn();
            mockedUseWorkerManagerContract.mockReturnValue({
                ...walletData,
                hireAndAuthorize: mockedHireAndAuthorize,
            } as unknown as WorkerManagerAuthManagerImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() => useNode(address));

            await act(async () => {
                result.current.hire(10000);
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedHireAndAuthorize).toHaveBeenCalled();
        });

        it('should trigger authorize function', async () => {
            const mockedAuthorize = jest.fn();
            mockedUseWorkerManagerContract.mockReturnValue({
                ...walletData,
                authorize: mockedAuthorize,
            } as unknown as WorkerManagerAuthManagerImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() => useNode(address));

            await act(async () => {
                result.current.authorize();
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedAuthorize).toHaveBeenCalled();
        });

        it('should correctly set values when workerManager exists', async () => {
            const available = true;
            const pending = false;
            const owned = true;
            const retired = false;
            const authorized = true;
            mockedUseWorkerManagerContract.mockReturnValue({
                ...walletData,
                getUser: () => Promise.resolve(account),
                isAvailable: () => Promise.resolve(available),
                isPending: () => Promise.resolve(pending),
                isOwned: () => Promise.resolve(owned),
                isRetired: () => Promise.resolve(retired),
                isAuthorized: () => Promise.resolve(authorized),
            } as unknown as WorkerManagerAuthManagerImpl);

            const { result } = renderHook(() => useNode(address));

            await waitFor(() => {
                expect(result.current.available).toBe(available);
                expect(result.current.pending).toBe(pending);
                expect(result.current.owned).toBe(owned);
                expect(result.current.retired).toBe(retired);
                expect(result.current.authorized).toBe(authorized);
            });
        });
    });
});
