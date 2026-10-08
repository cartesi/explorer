// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import {
    useFeeContract,
    useFlatRateCommissionContract,
    useStakingPoolContract,
} from '../../src/services/contracts';
import {
    useFlatRateCommission,
    useStakingPool,
    useStakingPoolCommission,
} from '../../src/services/pool';
import { Transaction, useTransaction } from '../../src/services/transaction';

jest.mock('../../src/components/wallet/useWallet');

jest.mock('../../src/services/transaction', () => ({
    useTransaction: jest.fn(),
}));

jest.mock('../../src/services/eth', () => ({
    useBlockNumber: jest.fn(),
}));

jest.mock('../../src/services/contracts', () => ({
    ...jest.requireActual('../../src/services/contracts'),
    useFlatRateCommissionContract: jest.fn(),
    useFeeContract: jest.fn(),
    useStakingPoolContract: jest.fn(),
}));

const address = '0x51937974a767da96dc1c3f9a7b07742e256f0ffe';
const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
const mockedUseTransaction = useTransaction as jest.MockedFunction<
    typeof useTransaction
>;

const mockedUseFlatRateCommissionContract =
    useFlatRateCommissionContract as jest.MockedFunction<
        typeof useFlatRateCommissionContract
    >;
const mockedUseStakingPoolContract =
    useStakingPoolContract as jest.MockedFunction<
        typeof useStakingPoolContract
    >;

const mockUseFeeContract = useFeeContract as jest.MockedFunction<
    typeof useFeeContract
>;

type Fee = ReturnType<typeof useFeeContract>;
type FlatRateCommission = ReturnType<typeof useFlatRateCommissionContract>;
type StakingPoolImpl = ReturnType<typeof useStakingPoolContract>;

const flatRateCommissionContract = {
    read: {
        rate: () => Promise.resolve(),
        feeRaiseTimeout: () => Promise.resolve(),
        maxRaise: () => Promise.resolve(),
        timeoutTimestamp: () => Promise.resolve(10000n),
    },
    write: {
        setRate: jest.fn(),
    },
};

const balance = {
    shares: 1000000n,
    depositTimestamp: 1000000n,
    balance: 1000000n,
};

// userBalance() returns [balance, shares, depositTimestamp]
const userBalance = [balance.balance, balance.shares, balance.depositTimestamp];

const stakingPoolContract = {
    read: {
        shares: () => Promise.resolve(),
        amount: () => Promise.resolve(),
        pos: () => Promise.resolve(),
        userBalance: () => Promise.resolve(userBalance),
        lockTime: () => Promise.resolve(10000n),
        getWithdrawBalance: () => Promise.resolve(),
        paused: () => Promise.resolve(),
        amounts: () => Promise.resolve([0n, 0n, 0n]),
    },
    write: {
        deposit: jest.fn(),
        stake: jest.fn(),
        unstake: jest.fn(),
        withdraw: jest.fn(),
        setName: jest.fn(),
        pause: jest.fn(),
        unpause: jest.fn(),
        hire: jest.fn(),
        retire: jest.fn(),
        rebalance: jest.fn(),
        update: jest.fn(),
    },
};

describe('pool service', () => {
    describe('useFlatRateCommission hook', () => {
        it('should return default initial values when fee is undefined', () => {
            mockedUseFlatRateCommissionContract.mockReturnValue(undefined);

            const { result } = renderHook(() => useFlatRateCommission(address));

            expect(result.current.rate).toBe(undefined);
            expect(result.current.maxRaise).toBe(undefined);
            expect(result.current.timeoutTimestamp).toBe(undefined);
            expect(result.current.raiseTimeout).toBe(undefined);
        });

        it('should set a transaction when changing gas', async () => {
            mockedUseFlatRateCommissionContract.mockReturnValue(
                flatRateCommissionContract as unknown as FlatRateCommission,
            );
            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);
            const { result } = renderHook(() => useFlatRateCommission(address));
            await act(async () => {
                result.current.changeRate(1000);
            });
            expect(mockedSet).toHaveBeenCalled();
        });

        it('should set correct values when fee is defined', async () => {
            const rate = 1000n;
            const raiseTimeout = 10000000n;
            const maxRaise = 1000000000n;
            const timeoutTimestamp = 10000n;
            mockedUseFlatRateCommissionContract.mockReturnValue({
                ...flatRateCommissionContract,
                read: {
                    rate: () => Promise.resolve(rate),
                    feeRaiseTimeout: () => Promise.resolve(raiseTimeout),
                    maxRaise: () => Promise.resolve(maxRaise),
                    timeoutTimestamp: () => Promise.resolve(timeoutTimestamp),
                },
            } as unknown as FlatRateCommission);

            const { result } = renderHook(() => useFlatRateCommission(address));

            await waitFor(() => {
                expect(result.current.rate).toBe(rate);
                expect(result.current.raiseTimeout).toBe(raiseTimeout);
                expect(result.current.maxRaise).toBe(maxRaise);
                expect(result.current.timeoutTimestamp).toStrictEqual(
                    new Date(Number(timeoutTimestamp) * 1000),
                );
            });
        });
    });

    describe('useStakingPoolCommission hook', () => {
        it('should return default initial values when fee is undefined', () => {
            mockUseFeeContract.mockReturnValue(undefined);

            const reward = 1000000n;
            const { result } = renderHook(() =>
                useStakingPoolCommission(address, reward),
            );

            expect(result.current.value).toBe(undefined);
            expect(result.current.loading).toBe(false);
        });

        it('should return correct values when fee is defined', async () => {
            const commission = 250000n;
            const getCommission = jest.fn().mockResolvedValue(commission);
            mockUseFeeContract.mockReturnValue({
                read: { getCommission },
            } as unknown as Fee);

            const reward = 1000000n;
            const { result } = renderHook(() =>
                useStakingPoolCommission(address, reward),
            );

            await waitFor(() => {
                expect(result.current.value).toStrictEqual(0.25);
                expect(result.current.loading).toBe(false);
            });
            expect(getCommission).toHaveBeenCalledWith([0n, reward]);
        });
    });

    describe('useStakingPool hook', () => {
        it('should trigger correct functions when invoking update function', async () => {
            const mockedUpdate = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                write: { ...stakingPoolContract.write, update: mockedUpdate },
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account),
            );

            await act(async () => {
                result.current.update();
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedUpdate).toHaveBeenCalled();
        });

        it('should trigger correct functions when invoking rebalance function', async () => {
            const mockedRebalance = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                write: {
                    ...stakingPoolContract.write,
                    rebalance: mockedRebalance,
                },
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account),
            );

            await act(async () => {
                result.current.rebalance();
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedRebalance).toHaveBeenCalled();
        });

        it('should trigger correct functions when invoking retire function', async () => {
            const mockedRetire = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                write: { ...stakingPoolContract.write, retire: mockedRetire },
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account),
            );

            await act(async () => {
                result.current.retire('worker-abc');
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedRetire).toHaveBeenCalled();
        });

        it('should trigger correct functions when invoking hire function', async () => {
            const mockedHire = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                write: { ...stakingPoolContract.write, hire: mockedHire },
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account),
            );

            await act(async () => {
                result.current.hire('worker-abc', 10000n);
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedHire).toHaveBeenCalled();
        });

        it('should trigger correct functions when invoking unpause function', async () => {
            const mockedUnpause = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                write: { ...stakingPoolContract.write, unpause: mockedUnpause },
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account),
            );

            await act(async () => {
                result.current.unpause();
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedUnpause).toHaveBeenCalled();
        });

        it('should trigger correct functions when invoking pause function', async () => {
            const mockedPause = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                write: { ...stakingPoolContract.write, pause: mockedPause },
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account),
            );

            await act(async () => {
                result.current.pause();
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedPause).toHaveBeenCalled();
        });

        it('should trigger correct functions when invoking setName function', async () => {
            const mockedSetName = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                write: { ...stakingPoolContract.write, setName: mockedSetName },
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account),
            );

            await act(async () => {
                result.current.setName('name-abc');
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedSetName).toHaveBeenCalled();
        });

        it('should trigger correct functions when invoking withdraw function', async () => {
            const mockedWithdraw = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                write: {
                    ...stakingPoolContract.write,
                    withdraw: mockedWithdraw,
                },
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account),
            );

            await act(async () => {
                result.current.withdraw(10000n);
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedWithdraw).toHaveBeenCalled();
        });

        it('should trigger correct functions when invoking unstake function', async () => {
            const mockedUnstake = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                write: { ...stakingPoolContract.write, unstake: mockedUnstake },
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account),
            );

            await act(async () => {
                result.current.unstake(10000n);
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedUnstake).toHaveBeenCalled();
        });

        it('should trigger correct functions when invoking stake function', async () => {
            const mockedStake = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                write: { ...stakingPoolContract.write, stake: mockedStake },
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account),
            );

            await act(async () => {
                result.current.stake(10000n);
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedStake).toHaveBeenCalled();
        });

        it('should trigger correct functions when invoking deposit function', async () => {
            const mockedDeposit = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                write: { ...stakingPoolContract.write, deposit: mockedDeposit },
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account),
            );

            await act(async () => {
                result.current.deposit(10000n);
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedDeposit).toHaveBeenCalled();
        });

        it('should set correct values when pool and account exist', async () => {
            const shares = 10000n;
            const amount = 100000n;
            const pos = 'pos-abc';
            const lockTime = 10000n;
            const paused = false;
            const withdrawBalance = 1000000n;
            const amounts = {
                stake: 10000n,
                unstake: 10000n,
                withdraw: 10000n,
            };
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                read: {
                    shares: () => Promise.resolve(shares),
                    amount: () => Promise.resolve(amount),
                    pos: () => Promise.resolve(pos),
                    userBalance: () => Promise.resolve(userBalance),
                    lockTime: () => Promise.resolve(lockTime),
                    getWithdrawBalance: () => Promise.resolve(withdrawBalance),
                    paused: () => Promise.resolve(paused),
                    amounts: () =>
                        Promise.resolve([
                            amounts.stake,
                            amounts.unstake,
                            amounts.withdraw,
                        ]),
                },
            } as unknown as StakingPoolImpl);

            const { result } = renderHook(() =>
                useStakingPool(address, account),
            );

            await waitFor(() => {
                expect(result.current.shares).toBe(shares);
                expect(result.current.amount).toBe(amount);
                expect(result.current.pos).toStrictEqual(pos);
                expect(result.current.depositTimestamp).toStrictEqual(
                    new Date(Number(balance.depositTimestamp) * 1000),
                );
                expect(result.current.withdrawBalance).toBe(withdrawBalance);
                expect(result.current.lockTime).toBe(lockTime);
                expect(result.current.stakeTimestamp).toStrictEqual(
                    new Date(
                        Number(balance.depositTimestamp + lockTime) * 1000,
                    ),
                );
                expect(result.current.balance).toBe(balance.balance);
                expect(result.current.stakedShares).toBe(balance.shares);
                expect(result.current.paused).toBe(paused);
                expect(result.current.amounts).toStrictEqual(amounts);
            });
        });
    });
});
