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
import { useStakingContract } from './contract';
import { useTransaction } from './transaction';

export const useStaking = () => {
    const { account } = useWeb3React<Web3Provider>();
    const staking = useStakingContract();

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
        if (staking && account) {
            staking.getStakedBalance(account).then(setStakedBalance);
            staking
                .getMaturingTimestamp(account)
                .then((value) =>
                    setMaturingTimestamp(new Date(value.toNumber() * 1000))
                );
            staking
                .getReleasingTimestamp(account)
                .then((value) =>
                    setReleasingTimestamp(new Date(value.toNumber() * 1000))
                );
            staking.getMaturingBalance(account).then(setMaturingBalance);
            staking.getReleasingBalance(account).then(setReleasingBalance);
        }
    }, [staking, account, blockNumber]);

    const stake = (amount: BigNumberish) => {
        if (staking) {
            try {
                // send transaction
                setTransaction(staking.stake(amount));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const unstake = (amount: BigNumberish) => {
        if (staking) {
            try {
                // send transaction
                setTransaction(staking.unstake(amount));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const withdraw = (amount: BigNumberish) => {
        if (staking) {
            try {
                // send transaction
                setTransaction(staking.withdraw(amount));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    return {
        staking,
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
