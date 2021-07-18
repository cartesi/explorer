// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
    BigNumber,
    BigNumberish,
    constants,
    ethers,
    FixedNumber,
} from 'ethers';
import { useBlockNumber } from './eth';
import {
    useStakingPoolContract,
    useFeeContract,
    useFlatRateCommissionContract,
    useGasTaxCommissionContract,
} from './contracts';
import { useTransaction } from './transaction';
import { useStakingContract } from './contracts/pos';

export interface StakingPoolCommission {
    value: number;
    loading: boolean;
}

export const useStakingPool = (address: string) => {
    const { account } = useWeb3React<Web3Provider>();
    const pool = useStakingPoolContract(address);
    const staking = useStakingContract();

    const blockNumber = useBlockNumber();
    const { waiting, error, setError, setTransaction } = useTransaction();

    const [stakedBalance, setStakedBalance] = useState<BigNumber>(
        constants.Zero
    );
    const [effectiveStake, setEffectiveStake] = useState<BigNumber>(
        constants.Zero
    );
    const [shares, setShares] = useState<BigNumber>(constants.Zero);
    const [amount, setAmount] = useState<BigNumber>(constants.Zero);
    const [unstakeTimestamp, setUnstakeTimestamp] = useState<Date>(null);
    const [withdrawBalance, setWithdrawBalance] = useState<BigNumber>(
        constants.Zero
    );
    const [releasedBalance, setReleasedBalance] = useState<BigNumber>(
        constants.Zero
    );
    const [paused, setPaused] = useState<Boolean>(false);

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

            // calculate user stake (tokens)
            setStakedBalance(
                shares.gt(0)
                    ? balance.shares.mul(amount).div(shares)
                    : ethers.constants.Zero
            );

            setUnstakeTimestamp(
                new Date(balance.unstakeTimestamp.toNumber() * 1000)
            );
            setReleasedBalance(balance.released);
            setWithdrawBalance(await pool.getWithdrawBalance());
            setPaused(await pool.paused());

            // get effective staked balance
            setEffectiveStake(await staking.getStakedBalance(pool.address));
        };
        if (pool && staking && account) {
            getData();
        }
    }, [pool, account, blockNumber]);

    const stake = (amount: BigNumberish) => {
        if (pool) {
            try {
                // send transaction
                setTransaction(pool.stake(amount));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const unstake = (amount: BigNumberish) => {
        if (pool) {
            try {
                // send transaction
                setTransaction(pool.unstake(amount));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const withdraw = () => {
        if (pool) {
            try {
                // send transaction
                setTransaction(pool.withdraw());
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const setName = (name: string) => {
        if (pool) {
            try {
                setTransaction(pool.setName(name));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const pause = () => {
        if (pool) {
            try {
                setTransaction(pool.pause());
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const unpause = () => {
        if (pool) {
            try {
                setTransaction(pool.unpause());
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const hire = (worker: string, amount: BigNumber) => {
        if (pool) {
            try {
                setTransaction(pool.hire(worker, { value: amount }));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const cancelHire = (worker: string) => {
        if (pool) {
            try {
                setTransaction(pool.cancelHire(worker));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const retire = (worker: string) => {
        if (pool) {
            try {
                setTransaction(pool.retire(worker));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const rebalance = () => {
        if (pool) {
            try {
                setTransaction(pool.rebalance());
            } catch (e) {
                setError(e.message);
            }
        }
    };

    return {
        pool,
        shares,
        amount,
        effectiveStake,
        error,
        waiting,
        stakedBalance,
        releasedBalance,
        withdrawBalance,
        unstakeTimestamp,
        paused,
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
    const { waiting, error, setError, setTransaction } = useTransaction();

    const setRate = (rate: number) => {
        if (fee) {
            try {
                setTransaction(fee.setRate(rate));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    return {
        setRate,
        waiting,
        error,
    };
};

export const useGasTaxCommission = (address: string) => {
    const fee = useGasTaxCommissionContract(address);
    const { waiting, error, setError, setTransaction } = useTransaction();

    const setGas = (gas: number) => {
        if (fee) {
            try {
                setTransaction(fee.setGas(gas));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    return {
        setGas,
        waiting,
        error,
    };
};
