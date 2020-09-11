// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useContext, useState, useEffect } from 'react';
import Web3Context from '../components/Web3Context';
import { Staking } from '../contracts/Staking';
import { StakingFactory } from '../contracts/StakingFactory';
import { formatCTSI, parseCTSI } from '../utils/token';

type AbiMap = Record<number, any>;
const stakingJson: AbiMap = {
    31337: require('@cartesi/pos/deployments/localhost/StakingImpl.json'),
};

export const useStaking = () => {
    const { provider, chain, account } = useContext(Web3Context);
    const [staking, setStaking] = useState<Staking>();
    const [address, setAddress] = useState<string>(null);

    const [stakedBalance, setStakedBalance] = useState<number>(0);
    const [finalizeDepositTimestamp, setFinalizeDepositTimestamp] = useState<Date>(null);
    const [finalizeWithdrawTimestamp, setFinalizeWithdrawTimestamp] = useState<Date>(null);
    const [unfinalizedDepositAmount, setUnfinalizedDepositAmount] = useState<number>(0);
    const [unfinalizedWithdrawAmount, setUnfinalizedWithdrawAmount] = useState<number>(0);
    
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // create the Staking, asynchronously
    useEffect(() => {
        if (provider) {
            const address = stakingJson[chain.chainId]?.address;
            if (!address) {
                setError(
                    `Staking not deployed at network '${chain.name}'`
                );
                return;
            }
            console.log(
                `Attaching Staking to address '${address}' deployed at network '${chain.name}'`
            );
            setStaking(
                StakingFactory.connect(address, provider.getSigner())
            );

            setAddress(address);
        }
    }, [provider, chain]);

    const updateState = () => {
        if (staking) {
            try {
                setError('');
                staking.getStakedBalance(account).then(value => setStakedBalance(formatCTSI(value)));

                staking.getFinalizeDepositTimestamp(account).then(value => setFinalizeDepositTimestamp(new Date(value.toNumber() * 1000)));
                staking.getFinalizeWithdrawTimestamp(account).then(value => setFinalizeWithdrawTimestamp(new Date(value.toNumber() * 1000)));
                staking.getUnfinalizedDepositAmount(account).then(value => setUnfinalizedDepositAmount(formatCTSI(value)));
                staking.getUnfinalizedWithdrawAmount(account).then(value => setUnfinalizedWithdrawAmount(formatCTSI(value)));
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
        amount: number
    ) => {
        if (staking) {
            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await staking.depositStake(parseCTSI(amount));

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
        amount: number
    ) => {
        if (staking) {
            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await staking.startWithdraw(parseCTSI(amount));

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
        address,
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