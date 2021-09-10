// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { BigNumber, BigNumberish, constants, FixedNumber } from 'ethers';
import { useBlockNumber } from './eth';
import {
    useStakingPoolContract,
    useFeeContract,
    useFlatRateCommissionContract,
    useGasTaxCommissionContract,
} from './contracts';
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
    stakedShares: BigNumber;
    balance: BigNumber;
    withdrawBalance: BigNumber;
    depositTimestamp: Date;
    stakeTimestamp: Date;
    paused: Boolean;
    amounts: Amounts;
    lockTime: BigNumber;
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

    // user amount of shares staked
    const [stakedShares, setStakedShares] = useState<BigNumber>(constants.Zero);

    // total number of shares of the pool
    const [shares, setShares] = useState<BigNumber>(constants.Zero);

    // total amount of token "in" pool
    const [amount, setAmount] = useState<BigNumber>(constants.Zero);

    // period to wait before staking
    const [lockTime, setLockTime] = useState<BigNumber>(constants.Zero);

    // instant when user can deposited
    const [depositTimestamp, setDepositTimestamp] = useState<Date>(null);

    // instant when user can stake
    const [stakeTimestamp, setStakeTimestamp] = useState<Date>(null);

    // amount of tokens user holds free
    const [balance, setBalance] = useState<BigNumber>(constants.Zero);

    // amount of token user can withdraw
    const [withdrawBalance, setWithdrawBalance] = useState<BigNumber>(
        constants.Zero
    );

    // flag if pool is paused for new stakes
    const [paused, setPaused] = useState<Boolean>(false);

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
            transaction.set(pool.deposit(amount));
        }
    };

    const stake = (amount: BigNumberish) => {
        if (pool) {
            transaction.set(pool.stake(amount));
        }
    };

    const unstake = (shares: BigNumberish) => {
        if (pool) {
            transaction.set(pool.unstake(shares));
        }
    };

    const withdraw = (amount: BigNumberish) => {
        if (pool) {
            transaction.set(pool.withdraw(amount));
        }
    };

    const setName = (name: string) => {
        if (pool) {
            transaction.set(pool.setName(name));
        }
    };

    const pause = () => {
        if (pool) {
            transaction.set(pool.pause());
        }
    };

    const unpause = () => {
        if (pool) {
            transaction.set(pool.unpause());
        }
    };

    const hire = (worker: string, amount: BigNumberish) => {
        if (pool) {
            transaction.set(pool.hire(worker, { value: amount }));
        }
    };

    const cancelHire = (worker: string) => {
        if (pool) {
            transaction.set(pool.cancelHire(worker));
        }
    };

    const retire = (worker: string) => {
        if (pool) {
            transaction.set(pool.retire(worker));
        }
    };

    const rebalance = () => {
        if (pool) {
            transaction.set(pool.rebalance());
        }
    };

    return {
        address,
        shares,
        amount,
        transaction,
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

export const useGasTaxCommission = (address: string) => {
    const fee = useGasTaxCommissionContract(address);
    const [gas, setGas] = useState<BigNumber>(undefined);
    const [maxRaise, setMaxRaise] = useState<BigNumber>(undefined);
    const [timeoutTimestamp, setTimeoutTimestamp] = useState<Date>(undefined);
    const [raiseTimeout, setRaiseTimeout] = useState<BigNumber>(undefined);
    const transaction = useTransaction();

    useEffect(() => {
        if (fee) {
            fee.gas().then(setGas);
            fee.feeRaiseTimeout().then(setRaiseTimeout);
            fee.maxRaise().then(setMaxRaise);
            fee.timeoutTimestamp().then((ts) =>
                setTimeoutTimestamp(new Date(ts.toNumber() * 1000))
            );
        }
    }, [fee]);

    const changeGas = (gas: number) => {
        if (fee) {
            transaction.set(fee.setGas(gas));
        }
    };

    return {
        gas,
        maxRaise,
        timeoutTimestamp,
        raiseTimeout,
        changeGas,
        transaction,
    };
};
