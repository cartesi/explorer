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
import { BigNumber, BigNumberish, constants } from 'ethers';
import { useBlockNumber } from './eth';
import { useStakingPoolContract } from './contracts';
import { useTransaction } from './transaction';

export const useStakingPool = (address: string) => {
    const { account } = useWeb3React<Web3Provider>();
    const stakingPool = useStakingPoolContract(address);

    const blockNumber = useBlockNumber();
    const { waiting, error, setError, setTransaction } = useTransaction();

    const [stakedBalance, setStakedBalance] = useState<BigNumber>(
        constants.Zero
    );
    const [maturingTimestamp, setMaturingTimestamp] = useState<Date>(null);
    const [releasingTimestamp, setReleasingTimestamp] = useState<Date>(null);
    const [maturingBalance, setMaturingBalance] = useState<BigNumber>(
        constants.Zero
    );
    const [releasingBalance, setReleasingBalance] = useState<BigNumber>(
        constants.Zero
    );

    useEffect(() => {
        if (stakingPool && account) {
            stakingPool.getStakedBalance(account).then(setStakedBalance);
            stakingPool
                .getMaturingTimestamp(account)
                .then((value) =>
                    setMaturingTimestamp(new Date(value.toNumber() * 1000))
                );
            stakingPool
                .getReleasingTimestamp(account)
                .then((value) =>
                    setReleasingTimestamp(new Date(value.toNumber() * 1000))
                );
            stakingPool.getMaturingBalance(account).then(setMaturingBalance);
            stakingPool.getReleasingBalance(account).then(setReleasingBalance);
        }
    }, [stakingPool, account, blockNumber]);

    const stake = (amount: BigNumberish) => {
        if (stakingPool) {
            try {
                // send transaction
                setTransaction(stakingPool.stake(amount));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const unstake = (amount: BigNumberish) => {
        if (stakingPool) {
            try {
                // send transaction
                setTransaction(stakingPool.unstake(amount));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const withdraw = (amount: BigNumberish) => {
        if (stakingPool) {
            try {
                // send transaction
                setTransaction(stakingPool.withdraw(amount));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    return {
        staking: stakingPool,
        error,
        waiting,
        stakedBalance,
        maturingTimestamp,
        releasingTimestamp,
        maturingBalance,
        releasingBalance,
        stake,
        unstake,
        withdraw,
    };
};
