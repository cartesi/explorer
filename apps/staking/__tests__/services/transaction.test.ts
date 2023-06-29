// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { renderHook, act, waitFor } from '@testing-library/react';
import { ContractTransaction } from 'ethers';
import { useWallet } from '@explorer/wallet/src/useWallet';
import { Transaction, useTransaction } from '../../src/services/transaction';
import { confirmations, Network } from '../../src/utils/networks';
import {
    buildContractReceipt,
    buildContractTransaction,
    buildContractReceiptEvent,
} from './mocks';

const walletMod = '@explorer/wallet/src/useWallet';

jest.mock(walletMod, () => {
    const originalModule = jest.requireActual(walletMod);
    return {
        __esModule: true,
        ...originalModule,
        useWallet: jest.fn(),
    };
});

const mockUseWallet = useWallet as jest.MockedFunction<typeof useWallet>;

describe('Transaction service', () => {
    const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
    beforeEach(() => {
        // Partial filled Happy returns
        mockUseWallet.mockReturnValue({
            account,
            active: true,
            activate: jest.fn(),
            deactivate: jest.fn(),
            chainId: 1,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should have a default state when initiated', () => {
        const { result } = renderHook(() => useTransaction<string>());
        const transaction = result.current;
        expect(transaction).toMatchObject({
            ack: expect.any(Function),
            set: expect.any(Function),
            acknowledged: true,
            error: undefined,
            isOngoing: false,
            receipt: undefined,
            result: undefined,
            state: 'acknowledged',
            submitting: false,
            transaction: undefined,
        } as Transaction<string>);
    });

    describe('Set stages', () => {
        it('should change state to submitting when a transaction is first set', () => {
            const { result } = renderHook(() => useTransaction<string>());
            expect(result.current).toHaveProperty('acknowledged', true);
            expect(result.current).toHaveProperty('submitting', false);
            expect(result.current).toHaveProperty('state', 'acknowledged');
            expect(result.current).toHaveProperty('isOngoing', false);

            act(() => {
                result.current.set(
                    //to be resolved promise.
                    new Promise<ContractTransaction>(() => null)
                );
            });

            expect(result.current).toHaveProperty('acknowledged', false);
            expect(result.current).toHaveProperty('submitting', true);
            expect(result.current).toHaveProperty('state', 'submitting');
            expect(result.current).toHaveProperty('isOngoing', true);
        });

        it('should change state to waiting_confirmation when contract-transaction resolve (i.e. user signed the transaction)', async () => {
            const contractTransaction = buildContractTransaction();
            contractTransaction.confirmations = 0;
            const { result } = renderHook(() => useTransaction<string>());

            expect(result.current).toHaveProperty('state', 'acknowledged');
            expect(result.current).toHaveProperty('isOngoing', false);

            const promise = new Promise<ContractTransaction>((resolve) =>
                act(() => resolve(contractTransaction))
            );

            act(() => {
                result.current.set(promise);
            });

            expect(result.current).toHaveProperty('state', 'submitting');
            expect(result.current).toHaveProperty('isOngoing', true);

            await waitFor(() =>
                expect(result.current.state).toBe('waiting_confirmation')
            );

            expect(result.current).toHaveProperty(
                'state',
                'waiting_confirmation'
            );
            expect(result.current.isOngoing).toBe(true);
            expect(result.current.submitting).toBe(false);
            expect(result.current.transaction).toBeDefined();
        });

        it('should change state to confirmed when contract-transaction reaches the expected confirmation number based on network', async () => {
            const contractTransaction = buildContractTransaction();
            contractTransaction.confirmations = confirmations[Network.MAINNET];
            // A closer to real dummy contract receipt
            contractTransaction.wait.mockResolvedValue(buildContractReceipt());
            const { result } = renderHook(() => useTransaction<string>());

            const promise = new Promise<ContractTransaction>((resolve) =>
                act(() => resolve(contractTransaction))
            );

            act(() => {
                result.current.set(promise);
            });

            await waitFor(() => expect(result.current.state).toBe('confirmed'));

            expect(result.current).toHaveProperty('state', 'confirmed');
            expect(result.current.isOngoing).toBe(false);
            expect(result.current.transaction).toBeDefined();
            expect(result.current.receipt).toBeDefined();
        });
    });

    describe('Error stages', () => {
        it('should change its state to errored when transaction is rejected for any reason', async () => {
            const { result } = renderHook(() => useTransaction<string>());

            expect(result.current.state).toEqual('acknowledged');

            const promise = Promise.reject(
                new Error('Metamask error goes here')
            );

            act(() => result.current.set(promise));

            expect(result.current.state).toEqual('submitting');

            await waitFor(() => expect(result.current.state).toBe('errored'));

            expect(result.current.state).toEqual('errored');
            expect(result.current.error).toEqual('Metamask error goes here');
        });

        it('should be able to acknowledge the transaction after an errored state', async () => {
            const { result } = renderHook(() => useTransaction<string>());
            const promise = Promise.reject(new Error('Random error'));
            act(() => result.current.set(promise));
            await waitFor(() => expect(result.current.state).toBe('errored'));
            expect(result.current.acknowledged).toBe(false);
            expect(result.current.state).toEqual('errored');

            act(() => result.current.ack());

            expect(result.current.state).toEqual('acknowledged');
            expect(result.current.acknowledged).toBe(true);
        });

        it('should handle transaction failures when trying to wait for confirmations', async () => {
            const contractTransaction = buildContractTransaction();
            contractTransaction.wait.mockRejectedValue(
                new Error('Network failure')
            );
            const { result } = renderHook(() => useTransaction<string>());

            const promise = new Promise<ContractTransaction>((resolve) =>
                act(() => resolve(contractTransaction))
            );

            act(() => {
                result.current.set(promise);
            });

            expect(result.current).toHaveProperty('state', 'submitting');

            await waitFor(() => expect(result.current.state).toBe('errored'));

            expect(result.current).toHaveProperty('state', 'errored');
            expect(result.current.error).toEqual('Network failure');
            expect(result.current.transaction).toBeDefined();
            expect(result.current.receipt).not.toBeDefined();
        });

        it('should handle exceptions coming from the result resolver', async () => {
            const contractTransaction = buildContractTransaction();
            contractTransaction.confirmations = confirmations[Network.MAINNET];
            // A closer to real dummy contract receipt but without any events.
            contractTransaction.wait.mockResolvedValue(buildContractReceipt());
            const { result } = renderHook(() =>
                useTransaction<string>((receipt) => {
                    // naive resolver
                    const event = receipt.events.find(
                        ({ event }) => event == 'DummyEvent'
                    );

                    return event.args[0];
                })
            );

            const promise = new Promise<ContractTransaction>((resolve) =>
                act(() => resolve(contractTransaction))
            );

            act(() => {
                result.current.set(promise);
            });

            await waitFor(() => expect(result.current.state).toBe('errored'));

            expect(result.current.state).toEqual('errored');
            expect(result.current.error).toEqual(
                `Cannot read properties of undefined (reading 'args')`
            );
            expect(result.current.result).not.toBeDefined();
        });
    });

    describe('Result resolver', () => {
        it('should be able to extract a result from a confirmed transaction', async () => {
            const contractTransaction = buildContractTransaction();
            contractTransaction.confirmations = confirmations[Network.MAINNET];
            // A closer to real dummy contract receipt
            const receipt = buildContractReceipt();
            const receiptEvt = buildContractReceiptEvent();
            receiptEvt.event = 'DummyEvent';
            receiptEvt.args = ['my-result-goes-here'];
            receipt.events = [receiptEvt];
            contractTransaction.wait.mockResolvedValue(receipt);
            const { result } = renderHook(() =>
                useTransaction<string>((receipt) => {
                    if (receipt.events) {
                        const event = receipt.events.find(
                            ({ event }) => event == 'DummyEvent'
                        );

                        return event.args[0];
                    }
                })
            );

            const promise = new Promise<ContractTransaction>((resolve) =>
                act(() => resolve(contractTransaction))
            );

            act(() => {
                result.current.set(promise);
            });

            await waitFor(() => expect(result.current.state).toBe('confirmed'));

            expect(result.current).toHaveProperty('state', 'confirmed');
            expect(result.current.result).toEqual('my-result-goes-here');
        });
    });
});
