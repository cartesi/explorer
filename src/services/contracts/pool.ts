// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { asAddress, useContract, useContractFromAddress } from '.';
import {
    feeAbi,
    flatRateCommissionAbi,
    stakingPoolAbi,
    stakingPoolFactoryAbi,
    stakingPoolFactoryAddress,
} from './generated';

export const useStakingPoolFactoryContract = () =>
    useContract(
        stakingPoolFactoryAbi,
        stakingPoolFactoryAddress,
        'StakingPoolFactoryImpl',
    );

export const useStakingPoolContract = (address: string) =>
    useContractFromAddress(stakingPoolAbi, asAddress(address));

/** The fee contract address a pool was created with. */
const useFeeAddress = (address: string): Address | undefined => {
    const pool = useStakingPoolContract(address);
    const [feeAddress, setFeeAddress] = useState<Address>();

    useEffect(() => {
        let cancelled = false;
        if (pool) {
            pool.read.fee().then((value) => {
                if (!cancelled) setFeeAddress(value);
            });
        } else {
            setFeeAddress(undefined);
        }
        return () => {
            cancelled = true;
        };
    }, [address, pool]);

    return feeAddress;
};

export const useFeeContract = (address: string) =>
    useContractFromAddress(feeAbi, useFeeAddress(address));

export const useFlatRateCommissionContract = (address: string) =>
    useContractFromAddress(flatRateCommissionAbi, useFeeAddress(address));
