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
    const { provider, chain } = useContext(Web3Context);
    const [staking, setStaking] = useState<Staking>();
    const [address, setAddress] = useState<string>(null);
    
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

    const getStakedBalance = async (
        address: string
    ) => {
        if (staking) {
            try {
                setError('');
                const balance = await staking.getStakedBalance(address);
                return formatCTSI(balance);
            } catch (e) {
                setError(e.message);
            }
        }
    };

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

                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    const getFinalizeDepositTimestamp = async (
        address: string
    ) => {
        if (staking) {
            try {
                setError('');

                const result = await staking.getFinalizeDepositTimestamp(address);
                return new Date(result.toNumber() * 1000);
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const getFinalizeWithdrawTimestamp = async (
        address: string
    ) => {
        if (staking) {
            try {
                setError('');

                const result = await staking.getFinalizeWithdrawTimestamp(address);
                return new Date(result.toNumber() * 1000);
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const getUnfinalizedDepositAmount = async (
        address: string
    ) => {
        if (staking) {
            try {
                setError('');

                const result = await staking.getUnfinalizedDepositAmount(address);
                return formatCTSI(result);
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const getUnfinalizedWithdrawAmount = async (
        address: string
    ) => {
        if (staking) {
            try {
                setError('');

                const result = await staking.getUnfinalizedWithdrawAmount(address);
                return formatCTSI(result);
            } catch (e) {
                setError(e.message);
            }
        }
    };

    return {
        staking,
        submitting,
        error,
        address,
        getStakedBalance,
        depositStake,
        finalizeStakes,
        startWithdraw,
        finalizeWithdraws,
        getFinalizeDepositTimestamp,
        getFinalizeWithdrawTimestamp,
        getUnfinalizedDepositAmount,
        getUnfinalizedWithdrawAmount
    };
};