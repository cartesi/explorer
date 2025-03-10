// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { BigNumber, BigNumberish, constants, FixedNumber } from 'ethers';
import { useEffect, useState } from 'react';
import {
    useFeeContract,
    useFlatRateCommissionContract,
    useStakingPoolContract,
} from './contracts';
import { useBlockNumber } from './eth';
import { Transaction, useTransaction } from './transaction';

export interface StakingPoolCommission {
    value: number;
    loading: boolean;
}

type Amounts = [BigNumber, BigNumber, BigNumber] & {
    stake: BigNumber;
    unstake: BigNumber;
    withdraw: BigNumber;
};

export interface StakingPool {
    address: string;
    shares: BigNumber;
    amount: BigNumber;
    transaction: Transaction<any>;
    depositTransaction: Transaction<any>;
    stakeTransaction: Transaction<any>;
    unstakeTransaction: Transaction<any>;
    withdrawTransaction: Transaction<any>;
    setNameTransaction: Transaction<any>;
    pauseTransaction: Transaction<any>;
    unpauseTransaction: Transaction<any>;
    hireTransaction: Transaction<any>;
    cancelHireTransaction: Transaction<any>;
    retireTransaction: Transaction<any>;
    updateTransaction: Transaction<any>;
    rebalanceTransaction: Transaction<any>;
    stakedShares: BigNumber;
    balance: BigNumber;
    withdrawBalance: BigNumber;
    depositTimestamp: Date;
    stakeTimestamp: Date;
    paused: boolean;
    amounts: Amounts;
    lockTime: BigNumber;
    pos: string;
    deposit: (amount: BigNumberish) => void;
    stake: (amount: BigNumberish) => void;
    unstake: (shares: BigNumberish) => void;
    withdraw: (amount: BigNumberish) => void;
    setName: (name: string) => void;
    pause: () => void;
    unpause: () => void;
    hire: (worker: string, amount: BigNumberish) => void;
    cancelHire: (worker: string) => void;
    retire: (worker: string) => void;
    rebalance: () => void;
    update: () => void;
    sharesToAmount: (s: BigNumber) => BigNumber;
    amountToShares: (a: BigNumber) => BigNumber;
}

export const useStakingPool = (
    address: string,
    account: string
): StakingPool => {
    // connect to pool
    const pool = useStakingPoolContract(address);

    // update on every eth block
    const blockNumber = useBlockNumber();

    // keep track of a transaction
    const transaction = useTransaction<void>();

    // dedicated deposit transaction
    const depositTransaction = useTransaction<void>();

    // dedicated stake transaction
    const stakeTransaction = useTransaction<void>();

    // dedicated unstake transaction
    const unstakeTransaction = useTransaction<void>();

    // dedicated withdraw transaction
    const withdrawTransaction = useTransaction<void>();

    // dedicated set name transaction
    const setNameTransaction = useTransaction<void>();

    // dedicated pause transaction
    const pauseTransaction = useTransaction<void>();

    // dedicated unpause transaction
    const unpauseTransaction = useTransaction<void>();

    // dedicated hire transaction
    const hireTransaction = useTransaction<void>();

    // dedicated cancelHire transaction
    const cancelHireTransaction = useTransaction<void>();

    // dedicated retire transaction
    const retireTransaction = useTransaction<void>();

    // dedicated update transaction
    const updateTransaction = useTransaction<void>();

    // dedicated rebalance transaction
    const rebalanceTransaction = useTransaction<void>();

    // user amount of shares staked
    const [stakedShares, setStakedShares] = useState<BigNumber>(constants.Zero);

    // total number of shares of the pool
    const [shares, setShares] = useState<BigNumber>(constants.Zero);

    // total amount of token "in" pool
    const [amount, setAmount] = useState<BigNumber>(constants.Zero);

    // period to wait before staking
    const [lockTime, setLockTime] = useState<BigNumber>(constants.Zero);

    // instant when user can deposit
    const [depositTimestamp, setDepositTimestamp] = useState<Date>(null);

    // instant when user can stake
    const [stakeTimestamp, setStakeTimestamp] = useState<Date>(null);

    // amount of tokens user holds free
    const [balance, setBalance] = useState<BigNumber>(constants.Zero);

    // amount of token user can withdraw
    const [withdrawBalance, setWithdrawBalance] = useState<BigNumber>(
        constants.Zero
    );

    // The PoS setup in the staking pool;
    const [pos, setPoS] = useState<string>(null);

    // flag if pool is paused for new stakes
    const [paused, setPaused] = useState<boolean>(false);

    // amounts of tokens to be moved to/from staking contract
    const [amounts, setAmounts] = useState<
        [BigNumber, BigNumber, BigNumber] & {
            stake: BigNumber;
            unstake: BigNumber;
            withdraw: BigNumber;
        }
    >();

    // convert from shares to amount of tokens
    const sharesToAmount = (s: BigNumber) =>
        shares.gt(0) ? s.mul(amount).div(shares) : BigNumber.from(0);

    // convert from amount of tokens to shares
    const amountToShares = (a: BigNumber) =>
        amount.gt(0) ? a.mul(shares).div(amount) : BigNumber.from(0);

    useEffect(() => {
        if (pool && account) {
            pool.shares().then(setShares);
            pool.amount().then(setAmount);
            pool.pos().then(setPoS);
            pool.userBalance(account).then((b) => {
                setStakedShares(b.shares);
                setDepositTimestamp(
                    new Date(b.depositTimestamp.toNumber() * 1000)
                );
                pool.lockTime().then((t) => {
                    setLockTime(t);
                    setStakeTimestamp(
                        new Date(b.depositTimestamp.add(t).toNumber() * 1000)
                    );
                });
                setBalance(b.balance);
            });
            pool.getWithdrawBalance().then(setWithdrawBalance);
            pool.paused().then(setPaused);
            pool.amounts().then(setAmounts);
        }
    }, [pool, account, blockNumber]);

    const deposit = (amount: BigNumberish) => {
        if (pool) {
            const nextTransaction = pool.deposit(amount);

            transaction.set(nextTransaction);
            depositTransaction.set(nextTransaction);
        }
    };

    const stake = (amount: BigNumberish) => {
        if (pool) {
            const nextTransaction = pool.stake(amount);

            transaction.set(nextTransaction);
            stakeTransaction.set(nextTransaction);
        }
    };

    const unstake = (shares: BigNumberish) => {
        if (pool) {
            const nextTransaction = pool.unstake(shares);

            transaction.set(nextTransaction);
            unstakeTransaction.set(nextTransaction);
        }
    };

    const withdraw = (amount: BigNumberish) => {
        if (pool) {
            const nextTransaction = pool.withdraw(amount);

            transaction.set(nextTransaction);
            withdrawTransaction.set(nextTransaction);
        }
    };

    const setName = (name: string) => {
        if (pool) {
            const nextTransaction = pool.setName(name);

            transaction.set(nextTransaction);
            setNameTransaction.set(nextTransaction);
        }
    };

    const pause = () => {
        if (pool) {
            const nextTransaction = pool.pause();

            transaction.set(nextTransaction);
            pauseTransaction.set(nextTransaction);
        }
    };

    const unpause = () => {
        if (pool) {
            const nextTransaction = pool.unpause();

            transaction.set(nextTransaction);
            unpauseTransaction.set(nextTransaction);
        }
    };

    const hire = (worker: string, amount: BigNumberish) => {
        if (pool) {
            const nextTransaction = pool.hire(worker, { value: amount });

            transaction.set(nextTransaction);
            hireTransaction.set(nextTransaction);
        }
    };

    const cancelHire = (worker: string) => {
        if (pool) {
            const nextTransaction = pool.cancelHire(worker);

            transaction.set(nextTransaction);
            cancelHireTransaction.set(nextTransaction);
        }
    };

    const retire = (worker: string) => {
        if (pool) {
            const nextTransaction = pool.retire(worker);

            transaction.set(nextTransaction);
            retireTransaction.set(nextTransaction);
        }
    };

    const rebalance = () => {
        if (pool) {
            const nextTransaction = pool.rebalance();

            transaction.set(nextTransaction);
            rebalanceTransaction.set(nextTransaction);
        }
    };

    const update = () => {
        if (pool) {
            const t = pool.update();
            transaction.set(t);
            updateTransaction.set(t);
        }
    };

    return {
        address,
        shares,
        amount,
        pos,
        transaction,
        depositTransaction,
        stakeTransaction,
        unstakeTransaction,
        withdrawTransaction,
        setNameTransaction,
        pauseTransaction,
        unpauseTransaction,
        hireTransaction,
        cancelHireTransaction,
        retireTransaction,
        updateTransaction,
        rebalanceTransaction,
        stakedShares,
        balance,
        withdrawBalance,
        depositTimestamp,
        stakeTimestamp,
        paused,
        amounts,
        lockTime,
        deposit,
        stake,
        unstake,
        withdraw,
        setName,
        pause,
        unpause,
        hire,
        cancelHire,
        retire,
        rebalance,
        sharesToAmount,
        amountToShares,
        update,
    };
};

export const useStakingPoolCommission = (
    address: string,
    reward: BigNumberish
) => {
    const fee = useFeeContract(address);
    const [commission, setCommission] = useState<StakingPoolCommission>({
        value: undefined,
        loading: false,
    });

    useEffect(() => {
        if (fee) {
            setCommission({
                value: undefined,
                loading: true,
            });
            fee.getCommission(0, reward).then((value) => {
                const percentage = FixedNumber.from(value)
                    .divUnsafe(FixedNumber.from(reward))
                    .toUnsafeFloat();
                setCommission({
                    value: percentage,
                    loading: false,
                });
            });
        }
    }, [fee, reward]);

    return commission;
};

export const useFlatRateCommission = (address: string) => {
    const fee = useFlatRateCommissionContract(address);
    const [rate, setRate] = useState<BigNumber>(undefined);
    const [maxRaise, setMaxRaise] = useState<BigNumber>(undefined);
    const [timeoutTimestamp, setTimeoutTimestamp] = useState<Date>(undefined);
    const [raiseTimeout, setRaiseTimeout] = useState<BigNumber>(undefined);
    const transaction = useTransaction();

    useEffect(() => {
        if (fee) {
            fee.rate().then(setRate);
            fee.feeRaiseTimeout().then(setRaiseTimeout);
            fee.maxRaise().then(setMaxRaise);
            fee.timeoutTimestamp().then((ts) =>
                setTimeoutTimestamp(new Date(ts.toNumber() * 1000))
            );
        }
    }, [fee]);

    const changeRate = (rate: number) => {
        if (fee) {
            transaction.set(fee.setRate(rate));
        }
    };

    return {
        rate,
        maxRaise,
        timeoutTimestamp,
        raiseTimeout,
        changeRate,
        transaction,
    };
};
