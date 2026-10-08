// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect, useState } from 'react';
import { ratio } from '../utils/bigint';
import {
    asAddress,
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

export type Amounts = {
    stake: bigint;
    unstake: bigint;
    withdraw: bigint;
};

export interface StakingPool {
    address: string;
    shares: bigint;
    amount: bigint;
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
    stakedShares: bigint;
    balance: bigint;
    withdrawBalance: bigint;
    depositTimestamp: Date;
    stakeTimestamp: Date;
    paused: boolean;
    amounts: Amounts;
    lockTime: bigint;
    pos: string;
    deposit: (amount: bigint) => void;
    stake: (amount: bigint) => void;
    unstake: (shares: bigint) => void;
    withdraw: (amount: bigint) => void;
    setName: (name: string) => void;
    pause: () => void;
    unpause: () => void;
    hire: (worker: string, amount: bigint) => void;
    cancelHire: (worker: string) => void;
    retire: (worker: string) => void;
    rebalance: () => void;
    update: () => void;
    sharesToAmount: (s: bigint) => bigint;
    amountToShares: (a: bigint) => bigint;
}

export const useStakingPool = (
    address: string,
    account: string,
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
    const [stakedShares, setStakedShares] = useState<bigint>(0n);

    // total number of shares of the pool
    const [shares, setShares] = useState<bigint>(0n);

    // total amount of token "in" pool
    const [amount, setAmount] = useState<bigint>(0n);

    // period to wait before staking
    const [lockTime, setLockTime] = useState<bigint>(0n);

    // instant when user can deposit
    const [depositTimestamp, setDepositTimestamp] = useState<Date>(null);

    // instant when user can stake
    const [stakeTimestamp, setStakeTimestamp] = useState<Date>(null);

    // amount of tokens user holds free
    const [balance, setBalance] = useState<bigint>(0n);

    // amount of token user can withdraw
    const [withdrawBalance, setWithdrawBalance] = useState<bigint>(0n);

    // The PoS setup in the staking pool;
    const [pos, setPoS] = useState<string>(null);

    // flag if pool is paused for new stakes
    const [paused, setPaused] = useState<boolean>(false);

    // amounts of tokens to be moved to/from staking contract
    const [amounts, setAmounts] = useState<Amounts>();

    // convert from shares to amount of tokens
    const sharesToAmount = (s: bigint) =>
        shares > 0n ? (s * amount) / shares : 0n;

    // convert from amount of tokens to shares
    const amountToShares = (a: bigint) =>
        amount > 0n ? (a * shares) / amount : 0n;

    useEffect(() => {
        if (pool && account) {
            const user = asAddress(account);
            pool.read.shares().then(setShares);
            pool.read.amount().then(setAmount);
            pool.read.pos().then(setPoS);
            pool.read
                .userBalance([user])
                .then(([userBalance, userShares, userDepositTimestamp]) => {
                    setStakedShares(userShares);
                    setDepositTimestamp(
                        new Date(Number(userDepositTimestamp) * 1000),
                    );
                    pool.read.lockTime().then((t) => {
                        setLockTime(t);
                        setStakeTimestamp(
                            new Date(Number(userDepositTimestamp + t) * 1000),
                        );
                    });
                    setBalance(userBalance);
                });
            pool.read.getWithdrawBalance().then(setWithdrawBalance);
            pool.read.paused().then(setPaused);
            pool.read
                .amounts()
                .then(([stake, unstake, withdraw]) =>
                    setAmounts({ stake, unstake, withdraw }),
                );
        }
    }, [pool, account, blockNumber]);

    const deposit = (amount: bigint) => {
        if (pool) {
            const nextTransaction = pool.write.deposit([amount]);

            transaction.set(nextTransaction);
            depositTransaction.set(nextTransaction);
        }
    };

    const stake = (amount: bigint) => {
        if (pool) {
            const nextTransaction = pool.write.stake([amount]);

            transaction.set(nextTransaction);
            stakeTransaction.set(nextTransaction);
        }
    };

    const unstake = (shares: bigint) => {
        if (pool) {
            const nextTransaction = pool.write.unstake([shares]);

            transaction.set(nextTransaction);
            unstakeTransaction.set(nextTransaction);
        }
    };

    const withdraw = (amount: bigint) => {
        if (pool) {
            const nextTransaction = pool.write.withdraw([amount]);

            transaction.set(nextTransaction);
            withdrawTransaction.set(nextTransaction);
        }
    };

    const setName = (name: string) => {
        if (pool) {
            const nextTransaction = pool.write.setName([name]);

            transaction.set(nextTransaction);
            setNameTransaction.set(nextTransaction);
        }
    };

    const pause = () => {
        if (pool) {
            const nextTransaction = pool.write.pause();

            transaction.set(nextTransaction);
            pauseTransaction.set(nextTransaction);
        }
    };

    const unpause = () => {
        if (pool) {
            const nextTransaction = pool.write.unpause();

            transaction.set(nextTransaction);
            unpauseTransaction.set(nextTransaction);
        }
    };

    const hire = (worker: string, amount: bigint) => {
        if (pool) {
            const nextTransaction = pool.write.hire([asAddress(worker)], {
                value: amount,
            });

            transaction.set(nextTransaction);
            hireTransaction.set(nextTransaction);
        }
    };

    const cancelHire = (worker: string) => {
        if (pool) {
            const nextTransaction = pool.write.cancelHire([asAddress(worker)]);

            transaction.set(nextTransaction);
            cancelHireTransaction.set(nextTransaction);
        }
    };

    const retire = (worker: string) => {
        if (pool) {
            const nextTransaction = pool.write.retire([asAddress(worker)]);

            transaction.set(nextTransaction);
            retireTransaction.set(nextTransaction);
        }
    };

    const rebalance = () => {
        if (pool) {
            const nextTransaction = pool.write.rebalance();

            transaction.set(nextTransaction);
            rebalanceTransaction.set(nextTransaction);
        }
    };

    const update = () => {
        if (pool) {
            const t = pool.write.update();
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

export const useStakingPoolCommission = (address: string, reward: bigint) => {
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
            fee.read.getCommission([0n, reward]).then((value) => {
                setCommission({
                    value: ratio(value, reward),
                    loading: false,
                });
            });
        }
    }, [fee, reward]);

    return commission;
};

export const useFlatRateCommission = (address: string) => {
    const fee = useFlatRateCommissionContract(address);
    const [rate, setRate] = useState<bigint>(undefined);
    const [maxRaise, setMaxRaise] = useState<bigint>(undefined);
    const [timeoutTimestamp, setTimeoutTimestamp] = useState<Date>(undefined);
    const [raiseTimeout, setRaiseTimeout] = useState<bigint>(undefined);
    const transaction = useTransaction();

    useEffect(() => {
        if (fee) {
            fee.read.rate().then(setRate);
            fee.read.feeRaiseTimeout().then(setRaiseTimeout);
            fee.read.maxRaise().then(setMaxRaise);
            fee.read
                .timeoutTimestamp()
                .then((ts) => setTimeoutTimestamp(new Date(Number(ts) * 1000)));
        }
    }, [fee]);

    const changeRate = (rate: number) => {
        if (fee) {
            transaction.set(fee.write.setRate([BigInt(rate)]));
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
