// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect, useState } from 'react';
import {
    StakingImpl__factory,
    PoS__factory,
    StakingPoolImpl__factory,
    PoS,
    Staking,
    StakingPoolImpl,
    Fee,
    Fee__factory,
} from '@cartesi/pos-private';

import mainnet from '@cartesi/pos-private/export/abi/mainnet.json';
import rinkeby from '@cartesi/pos-private/export/abi/rinkeby.json';
import goerli from '@cartesi/pos-private/export/abi/goerli.json';
import kovan from '@cartesi/pos-private/export/abi/kovan.json';

import localhost from './localhost.json';

import { ChainMap, useContract, useContractFromAddress } from '.';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

const abis: ChainMap = {
    1: mainnet,
    4: rinkeby,
    5: goerli,
    42: kovan,
    31337: localhost,
};

export const useStakingContract = (): Staking => {
    return useContract(StakingImpl__factory.connect, abis, 'StakingImpl');
};

export const usePoSContract = (): PoS => {
    return useContract(PoS__factory.connect, abis, 'PoS');
};

export const useStakingPoolContract = (address: string): StakingPoolImpl => {
    return useContractFromAddress(StakingPoolImpl__factory.connect, address);
};

export const useFeeContract = (address: string): Fee => {
    const [fee, setFee] = useState<Fee>();
    const pool = useStakingPoolContract(address);
    const { library } = useWeb3React<Web3Provider>();
    useEffect(() => {
        if (pool && library) {
            pool.poolFee().then((feeAddress) => {
                setFee(Fee__factory.connect(feeAddress, library));
            });
        }
    }, [address, pool, library]);
    return fee;
};
