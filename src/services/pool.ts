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
import { useTransaction } from './transaction';

export interface StakingPoolCommission {
    value: number;
    loading: boolean;
}

export const useStakingPool = (address: string, account: string) => {
    // connect to pool
    const pool = useStakingPoolContract(address);

    // update on every eth block
    const blockNumber = useBlockNumber();

    // keep track of a transaction
    const transaction = useTransaction<void>();

    // user amount of shares staked
    const [stakedShares, setStakedShares] = useState<BigNumber>(constants.Zero);

    // user stake converted from shares to tokens
    const [stakedBalance, setStakedBalance] = useState<BigNumber>(
        constants.Zero
    );

    // total number of shares of the pool
    const [shares, setShares] = useState<BigNumber>(constants.Zero);

    // total amount of token "in" pool
    const [amount, setAmount] = useState<BigNumber>(constants.Zero);

    // instant when user can unstake
    const [unstakeTimestamp, setUnstakeTimestamp] = useState<Date>(null);

    // amount of tokens user requested to withdraw
    const [releasedBalance, setReleasedBalance] = useState<BigNumber>(
        constants.Zero
    );

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
        const getData = async () => {
            // query pool total shares
            const shares = await pool.shares();
            setShares(shares);

            // query pool token amount
            const amount = await pool.amount();
            setAmount(amount);

            // query user balance
            const balance = await pool.userBalance(account);

            // user staked shares
            setStakedShares(balance.shares);

            // calculate user stake in tokens
            setStakedBalance(sharesToAmount(balance.shares));

            setUnstakeTimestamp(
                new Date(balance.unstakeTimestamp.toNumber() * 1000)
            );
            setReleasedBalance(balance.released);
            setWithdrawBalance(await pool.getWithdrawBalance());
            setPaused(await pool.paused());

            // query rebalance amounts
            setAmounts(await pool.amounts());
        };
        if (pool && account) {
            getData();
        }
    }, [pool, account, blockNumber]);

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

    const withdraw = () => {
        if (pool) {
            transaction.set(pool.withdraw());
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

    const hire = (worker: string, amount: BigNumber) => {
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
        pool,
        shares,
        amount,
        transaction,
        stakedBalance,
        stakedShares,
        releasedBalance,
        withdrawBalance,
        unstakeTimestamp,
        paused,
        amounts,
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
    }, [fee]);

    return commission;
};

export const useFlatRateCommission = (address: string) => {
    const fee = useFlatRateCommissionContract(address);
    const transaction = useTransaction();

    const setRate = (rate: number) => {
        if (fee) {
            transaction.set(fee.setRate(rate));
        }
    };

    return {
        setRate,
        transaction,
    };
};

export const useGasTaxCommission = (address: string) => {
    const fee = useGasTaxCommissionContract(address);
    const transaction = useTransaction();

    const setGas = (gas: number) => {
        if (fee) {
            transaction.set(fee.setGas(gas));
        }
    };

    return {
        setGas,
        transaction,
    };
};
