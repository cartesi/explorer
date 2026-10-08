// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect, useState } from 'react';
import { asAddress, useStakingContract } from './contracts';
import { useBlockNumber } from './eth';
import { useTransaction } from './transaction';

export const useStaking = (user: string) => {
    const staking = useStakingContract();
    const blockNumber = useBlockNumber();
    const stakeTransaction = useTransaction();
    const unstakeTransaction = useTransaction();
    const withdrawTransaction = useTransaction();
    const [stakedBalance, setStakedBalance] = useState<bigint>(0n);
    const [maturingTimestamp, setMaturingTimestamp] = useState<Date>(null);
    const [releasingTimestamp, setReleasingTimestamp] = useState<Date>(null);
    const [maturingBalance, setMaturingBalance] = useState<bigint>(0n);
    const [releasingBalance, setReleasingBalance] = useState<bigint>(0n);

    useEffect(() => {
        if (staking && user) {
            const address = asAddress(user);
            staking.read.getStakedBalance([address]).then(setStakedBalance);
            staking.read
                .getMaturingTimestamp([address])
                .then((value) =>
                    setMaturingTimestamp(new Date(Number(value) * 1000)),
                );
            staking.read
                .getReleasingTimestamp([address])
                .then((value) =>
                    setReleasingTimestamp(new Date(Number(value) * 1000)),
                );
            staking.read.getMaturingBalance([address]).then(setMaturingBalance);
            staking.read
                .getReleasingBalance([address])
                .then(setReleasingBalance);
        } else if (!staking && !user) {
            setStakedBalance(0n);
            setReleasingBalance(0n);
            setMaturingBalance(0n);
        }
    }, [staking, user, blockNumber]);

    const stake = (amount: bigint) => {
        if (staking) {
            stakeTransaction.set(staking.write.stake([amount]));
        }
    };

    const unstake = (amount: bigint) => {
        if (staking) {
            unstakeTransaction.set(staking.write.unstake([amount]));
        }
    };

    const withdraw = (amount: bigint) => {
        if (staking) {
            withdrawTransaction.set(staking.write.withdraw([amount]));
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
