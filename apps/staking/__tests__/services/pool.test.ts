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
import {
    useFlatRateCommission,
    useGasTaxCommission,
    useStakingPool,
    useStakingPoolCommission,
} from '../../src/services/pool';
import {
    useFeeContract,
    useFlatRateCommissionContract,
    useGasTaxCommissionContract,
    useStakingPoolContract,
} from '../../src/services/contracts';
import { useStakingPoolFactory } from '../../src/services/poolFactory';
import { useTransaction, Transaction } from '../../src/services/transaction';
import { Web3Provider } from '@ethersproject/providers';
import { WalletConnectionContextProps } from '@explorer/wallet/src/definitions';
import { useStakingPoolFactoryContract } from '../../src/services/contracts';
import {
    Fee,
    FlatRateCommission,
    GasTaxCommission,
    StakingPoolFactoryImpl,
    StakingPoolImpl,
} from '@cartesi/staking-pool';
import { act } from 'react-dom/test-utils';
import { BigNumber, FixedNumber } from 'ethers';

jest.mock('@explorer/wallet');

jest.mock('../../src/services/transaction', () => ({
    useTransaction: jest.fn(),
}));

jest.mock('../../src/services/eth', () => ({
    useBlockNumber: jest.fn(),
}));

jest.mock('../../src/services/contracts', () => ({
    useGasTaxCommissionContract: jest.fn(),
    useFlatRateCommissionContract: jest.fn(),
    useFeeContract: jest.fn(),
    useStakingPoolContract: jest.fn(),
}));

const address = '0x51937974a767da96dc1c3f9a7b07742e256f0ffe';
const account = '0x907eA0e65Ecf3af503007B382E1280Aeb46104ad';
const mockedUseTransaction = useTransaction as jest.MockedFunction<
    typeof useTransaction
>;

const mockedUseGasTaxCommissionContract =
    useGasTaxCommissionContract as jest.MockedFunction<
        typeof useGasTaxCommissionContract
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

const gasTaxCommissionContract = {
    setGas: jest.fn(),
    gas: () => Promise.resolve(),
    feeRaiseTimeout: () => Promise.resolve(),
    maxRaise: () => Promise.resolve(),
    timeoutTimestamp: () => Promise.resolve(BigNumber.from('10000')),
};

const flatRateCommissionContract = {
    setRate: jest.fn(),
    rate: () => Promise.resolve(),
    feeRaiseTimeout: () => Promise.resolve(),
    maxRaise: () => Promise.resolve(),
    timeoutTimestamp: () => Promise.resolve(BigNumber.from('10000')),
};

const balance = {
    shares: BigNumber.from('1000000'),
    depositTimestamp: BigNumber.from('1000000'),
    balance: BigNumber.from('1000000'),
};

const stakingPoolContract = {
    shares: () => Promise.resolve(),
    amount: () => Promise.resolve(),
    pos: () => Promise.resolve(),
    userBalance: () => Promise.resolve(balance),
    lockTime: () => Promise.resolve(BigNumber.from('10000')),
    getWithdrawBalance: () => Promise.resolve(),
    paused: () => Promise.resolve(),
    amounts: () => Promise.resolve(),
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
};

describe('pool service', () => {
    describe('useGasTaxCommission hook', () => {
        it('should return default initial values when fee is undefined', () => {
            mockedUseGasTaxCommissionContract.mockReturnValue(undefined);

            const { result } = renderHook(() => useGasTaxCommission(address));

            expect(result.current.gas).toBe(undefined);
            expect(result.current.maxRaise).toBe(undefined);
            expect(result.current.timeoutTimestamp).toBe(undefined);
            expect(result.current.raiseTimeout).toBe(undefined);
        });

        it('should set a transaction when changing gas', async () => {
            mockedUseGasTaxCommissionContract.mockReturnValue(
                gasTaxCommissionContract as unknown as GasTaxCommission
            );
            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);
            const { result } = renderHook(() => useGasTaxCommission(address));
            await act(async () => {
                result.current.changeGas(1000);
            });
            expect(mockedSet).toHaveBeenCalled();
        });

        it('should set correct values when fee is defined', async () => {
            const gas = BigNumber.from('1000');
            const raiseTimeout = BigNumber.from('10000000');
            const maxRaise = BigNumber.from('1000000000');
            const timeoutTimestamp = BigNumber.from('10000');
            mockedUseGasTaxCommissionContract.mockReturnValue({
                setGas: jest.fn(),
                gas: () => Promise.resolve(gas),
                feeRaiseTimeout: () => Promise.resolve(raiseTimeout),
                maxRaise: () => Promise.resolve(maxRaise),
                timeoutTimestamp: () => Promise.resolve(timeoutTimestamp),
            } as unknown as GasTaxCommission);

            const { result } = renderHook(() => useGasTaxCommission(address));

            await waitFor(() => {
                expect(result.current.gas).toStrictEqual(gas);
                expect(result.current.raiseTimeout).toStrictEqual(raiseTimeout);
                expect(result.current.maxRaise).toStrictEqual(maxRaise);
                expect(result.current.timeoutTimestamp).toStrictEqual(
                    new Date(timeoutTimestamp.toNumber() * 1000)
                );
            });
        });
    });

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
                flatRateCommissionContract as unknown as FlatRateCommission
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
            const rate = BigNumber.from('1000');
            const raiseTimeout = BigNumber.from('10000000');
            const maxRaise = BigNumber.from('1000000000');
            const timeoutTimestamp = BigNumber.from('10000');
            mockedUseFlatRateCommissionContract.mockReturnValue({
                setRate: jest.fn(),
                rate: () => Promise.resolve(rate),
                feeRaiseTimeout: () => Promise.resolve(raiseTimeout),
                maxRaise: () => Promise.resolve(maxRaise),
                timeoutTimestamp: () => Promise.resolve(timeoutTimestamp),
            } as unknown as FlatRateCommission);

            const { result } = renderHook(() => useFlatRateCommission(address));

            await waitFor(() => {
                expect(result.current.rate).toStrictEqual(rate);
                expect(result.current.raiseTimeout).toStrictEqual(raiseTimeout);
                expect(result.current.maxRaise).toStrictEqual(maxRaise);
                expect(result.current.timeoutTimestamp).toStrictEqual(
                    new Date(timeoutTimestamp.toNumber() * 1000)
                );
            });
        });
    });

    describe('useStakingPoolCommission hook', () => {
        it('should return default initial values when fee is undefined', () => {
            mockUseFeeContract.mockReturnValue(undefined);

            const reward = BigNumber.from('1000000');
            const { result } = renderHook(() =>
                useStakingPoolCommission(address, reward)
            );

            expect(result.current.value).toBe(undefined);
            expect(result.current.loading).toBe(false);
        });

        it('should return correct values when fee is defined', async () => {
            const commission = BigNumber.from('1000000');
            mockUseFeeContract.mockReturnValue({
                getCommission: () => Promise.resolve(commission),
            } as unknown as Fee);

            const reward = BigNumber.from('1000000');
            const { result } = renderHook(() =>
                useStakingPoolCommission(address, reward)
            );

            await waitFor(() => {
                expect(result.current.value).toStrictEqual(
                    FixedNumber.from(commission)
                        .divUnsafe(FixedNumber.from(reward))
                        .toUnsafeFloat()
                );
                expect(result.current.loading).toBe(false);
            });
        });
    });

    describe('useStakingPool hook', () => {
        it('should trigger correct functions when invoking update function', async () => {
            const mockedUpdate = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                update: mockedUpdate,
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account)
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
                rebalance: mockedRebalance,
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account)
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
                retire: mockedRetire,
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account)
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
                hire: mockedHire,
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account)
            );

            await act(async () => {
                result.current.hire('worker-abc', BigNumber.from('10000'));
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedHire).toHaveBeenCalled();
        });

        it('should trigger correct functions when invoking unpause function', async () => {
            const mockedUnpause = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                unpause: mockedUnpause,
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account)
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
                pause: mockedPause,
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account)
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
                setName: mockedSetName,
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account)
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
                withdraw: mockedWithdraw,
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account)
            );

            await act(async () => {
                result.current.withdraw(BigNumber.from('10000'));
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedWithdraw).toHaveBeenCalled();
        });

        it('should trigger correct functions when invoking unstake function', async () => {
            const mockedUnstake = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                unstake: mockedUnstake,
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account)
            );

            await act(async () => {
                result.current.unstake(BigNumber.from('10000'));
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedUnstake).toHaveBeenCalled();
        });

        it('should trigger correct functions when invoking stake function', async () => {
            const mockedStake = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                stake: mockedStake,
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account)
            );

            await act(async () => {
                result.current.stake(BigNumber.from('10000'));
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedStake).toHaveBeenCalled();
        });

        it('should trigger correct functions when invoking deposit function', async () => {
            const mockedDeposit = jest.fn();
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                deposit: mockedDeposit,
            } as unknown as StakingPoolImpl);

            const mockedSet = jest.fn();
            mockedUseTransaction.mockReturnValue({
                set: mockedSet,
            } as unknown as Transaction<any>);

            const { result } = renderHook(() =>
                useStakingPool(address, account)
            );

            await act(async () => {
                result.current.deposit(BigNumber.from('10000'));
            });

            expect(mockedSet).toHaveBeenCalled();
            expect(mockedDeposit).toHaveBeenCalled();
        });

        it('should set correct values when pool and account exist', async () => {
            const shares = BigNumber.from('10000');
            const amount = BigNumber.from('100000');
            const pos = 'pos-abc';
            const lockTime = BigNumber.from('10000');
            const paused = false;
            const withdrawBalance = BigNumber.from('1000000');
            const amounts = {
                stake: BigNumber.from('10000'),
                unstake: BigNumber.from('10000'),
                withdraw: BigNumber.from('10000'),
            };
            mockedUseStakingPoolContract.mockReturnValue({
                ...stakingPoolContract,
                shares: () => Promise.resolve(shares),
                amount: () => Promise.resolve(amount),
                pos: () => Promise.resolve(pos),
                userBalance: () => Promise.resolve(balance),
                lockTime: () => Promise.resolve(lockTime),
                getWithdrawBalance: () => Promise.resolve(withdrawBalance),
                paused: () => Promise.resolve(paused),
                amounts: () => Promise.resolve(amounts),
            } as unknown as StakingPoolImpl);

            const { result } = renderHook(() =>
                useStakingPool(address, account)
            );

            await waitFor(() => {
                expect(result.current.shares).toStrictEqual(shares);
                expect(result.current.amount).toStrictEqual(amount);
                expect(result.current.pos).toStrictEqual(pos);
                expect(result.current.depositTimestamp).toStrictEqual(
                    new Date(balance.depositTimestamp.toNumber() * 1000)
                );
                expect(result.current.withdrawBalance).toStrictEqual(
                    withdrawBalance
                );
                expect(result.current.lockTime).toStrictEqual(lockTime);
                expect(result.current.stakeTimestamp).toStrictEqual(
                    new Date(
                        balance.depositTimestamp.add(lockTime).toNumber() * 1000
                    )
                );
                expect(result.current.balance).toStrictEqual(balance.balance);
                expect(result.current.paused).toBe(paused);
                expect(result.current.amounts).toStrictEqual(amounts);
            });
        });
    });
});
