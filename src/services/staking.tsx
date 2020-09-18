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
import { Staking } from '../contracts/Staking';
import { StakingFactory } from '../contracts/StakingFactory';
import { networks } from '../utils/networks';
import { BigNumber, BigNumberish } from 'ethers';

export const useStaking = () => {
    const { library, chainId, account } = useWeb3React<Web3Provider>();
    const [staking, setStaking] = useState<Staking>();

    const [stakedBalance, setStakedBalance] = useState<BigNumber>(BigNumber.from(0));
    const [finalizeDepositTimestamp, setFinalizeDepositTimestamp] = useState<Date>(null);
    const [finalizeWithdrawTimestamp, setFinalizeWithdrawTimestamp] = useState<Date>(null);
    const [unfinalizedDepositAmount, setUnfinalizedDepositAmount] = useState<BigNumber>(BigNumber.from(0));
    const [unfinalizedWithdrawAmount, setUnfinalizedWithdrawAmount] = useState<BigNumber>(BigNumber.from(0));
    
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // create the Staking, asynchronously
    useEffect(() => {
        if (library && chainId) {
            const network = networks[chainId];
            const stakingImplJson = require(`@cartesi/pos/deployments/${network}/StakingImpl.json`);
            const address = stakingImplJson?.address;
            if (!address) {
                setError(
                    `Staking not deployed at network '${chainId}'`
                );
                return;
            }
            console.log(
                `Attaching Staking to address '${address}' deployed at network '${chainId}'`
            );
            setStaking(
                StakingFactory.connect(address, library.getSigner())
            );
        }
    }, [library, chainId]);

    const updateState = () => {
        if (staking && account) {
            try {
                setError('');
                staking.getStakedBalance(account).then(setStakedBalance);
                staking.getFinalizeDepositTimestamp(account).then(value => setFinalizeDepositTimestamp(new Date(value.toNumber() * 1000)));
                staking.getFinalizeWithdrawTimestamp(account).then(value => setFinalizeWithdrawTimestamp(new Date(value.toNumber() * 1000)));
                staking.getUnfinalizedDepositAmount(account).then(setUnfinalizedDepositAmount);
                staking.getUnfinalizedWithdrawAmount(account).then(setUnfinalizedWithdrawAmount);
            } catch (e) {
                setError(e.message);
            }
        }
    };

    useEffect(() => {
        if (staking && account) {
            updateState();
        }
    }, [staking, account]);

    const depositStake = async (
        amount: BigNumberish
    ) => {
        if (staking) {
            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await staking.depositStake(amount);

                // wait for confirmation
                await transaction.wait(1);

                updateState();

                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    const finalizeStakes = async () => {
        if (staking) {
            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await staking.finalizeStakes();

                // wait for confirmation
                await transaction.wait(1);

                updateState();

                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    const startWithdraw = async (
        amount: BigNumberish
    ) => {
        if (staking) {
            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await staking.startWithdraw(amount);

                // wait for confirmation
                await transaction.wait(1);

                updateState();

                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    const finalizeWithdraws = async () => {
        if (staking) {
            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await staking.finalizeWithdraws();

                // wait for confirmation
                await transaction.wait(1);

                updateState();

                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    return {
        staking,
        submitting,
        error,
        stakedBalance,
        finalizeDepositTimestamp,
        finalizeWithdrawTimestamp,
        unfinalizedDepositAmount,
        unfinalizedWithdrawAmount,
        depositStake,
        finalizeStakes,
        startWithdraw,
        finalizeWithdraws
    };
};