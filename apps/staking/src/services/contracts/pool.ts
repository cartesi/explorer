// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Fee,
    Fee__factory,
    FlatRateCommission,
    FlatRateCommission__factory,
    StakingPoolFactoryImpl,
    StakingPoolFactoryImpl__factory,
    StakingPoolImpl,
    StakingPoolImpl__factory,
} from '@cartesi/staking-pool';
import { useEffect, useState } from 'react';

import goerli from '@cartesi/staking-pool/export/abi/goerli.json';
import mainnet from '@cartesi/staking-pool/export/abi/mainnet.json';

import localhost from './localhost.json';

import { useWallet } from '@explorer/wallet';
import { ChainMap, useContract, useContractFromAddress } from '.';

const abis: ChainMap = {
    1: mainnet,
    5: goerli,
    31337: localhost,
};

export const useStakingPoolFactoryContract = (): StakingPoolFactoryImpl => {
    return useContract(
        StakingPoolFactoryImpl__factory.connect,
        abis,
        'StakingPoolFactoryImpl'
    );
};

export const useStakingPoolContract = (address: string): StakingPoolImpl => {
    return useContractFromAddress(StakingPoolImpl__factory.connect, address);
};

export const useFeeContract = (address: string): Fee => {
    const [fee, setFee] = useState<Fee>();
    const pool = useStakingPoolContract(address);
    const { library } = useWallet();
    useEffect(() => {
        if (pool && library) {
            pool.fee().then((feeAddress) => {
                setFee(Fee__factory.connect(feeAddress, library));
            });
        }
    }, [address, pool, library]);
    return fee;
};

export const useFlatRateCommissionContract = (
    address: string
): FlatRateCommission => {
    const [feeAddress, setFeeAddress] = useState<string>();
    const pool = useStakingPoolContract(address);

    useEffect(() => {
        if (pool) {
            pool.fee().then(setFeeAddress);
        }
    }, [address, pool]);

    return useContractFromAddress(
        FlatRateCommission__factory.connect,
        feeAddress
    );
};
