// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { BigNumber, BigNumberish, constants } from 'ethers';
import { useEffect, useState } from 'react';
import { useStakingContract } from './contracts';
import { useBlockNumber } from './eth';
import { useTransaction } from './transaction';

export const useStaking = (user: string) => {
    const staking = useStakingContract();
    const blockNumber = useBlockNumber();
    const stakeTransaction = useTransaction();
    const unstakeTransaction = useTransaction();
    const withdrawTransaction = useTransaction();
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
        if (staking && user) {
            staking.getStakedBalance(user).then(setStakedBalance);
            staking
                .getMaturingTimestamp(user)
                .then((value) =>
                    setMaturingTimestamp(new Date(value.toNumber() * 1000))
                );
            staking
                .getReleasingTimestamp(user)
                .then((value) =>
                    setReleasingTimestamp(new Date(value.toNumber() * 1000))
                );
            staking.getMaturingBalance(user).then(setMaturingBalance);
            staking.getReleasingBalance(user).then(setReleasingBalance);
        } else if (!staking && !user) {
            setStakedBalance(constants.Zero);
            setReleasingBalance(constants.Zero);
            setMaturingBalance(constants.Zero);
        }
    }, [staking, user, blockNumber]);

    const stake = (amount: BigNumberish) => {
        if (staking) {
            stakeTransaction.set(staking.stake(amount));
        }
    };

    const unstake = (amount: BigNumberish) => {
        if (staking) {
            unstakeTransaction.set(staking.unstake(amount));
        }
    };

    const withdraw = (amount: BigNumberish) => {
        if (staking) {
            withdrawTransaction.set(staking.withdraw(amount));
        }
    };

    return {
        staking,
        stakeTransaction,
        unstakeTransaction,
        withdrawTransaction,
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
