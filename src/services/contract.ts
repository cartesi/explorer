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
import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';

import {
    WorkerManagerAuthManagerImplFactory,
    WorkerManagerAuthManagerImpl,
} from '@cartesi/util';
import { StakingImplFactory, StakingImpl, PoSFactory, PoS } from '@cartesi/pos';
import { CartesiToken } from '@cartesi/token';
import { CartesiToken__factory } from '@cartesi/token/dist/src/types/factories/CartesiToken__factory';

import pos_rinkeby from '@cartesi/pos/abi/rinkeby.json';
import pos_goerli from '@cartesi/pos/abi/goerli.json';
import pos_kovan from '@cartesi/pos/abi/kovan.json';

import util_rinkeby from '@cartesi/util/export/abi/rinkeby.json';
import util_goerli from '@cartesi/util/export/abi/goerli.json';
import util_kovan from '@cartesi/util/export/abi/kovan.json';

import token_rinkeby from '@cartesi/token/export/abi/rinkeby.json';
import token_goerli from '@cartesi/token/export/abi/goerli.json';
import token_kovan from '@cartesi/token/export/abi/kovan.json';

import localhost from './localhost.json';

interface ContractAbi {
    address: string;
    abi: any[];
}

interface ContractMap {
    [name: string]: ContractAbi;
}

interface ChainAbi {
    name: string;
    chainId: string;
    contracts: ContractMap;
}

interface ChainMap {
    [chainId: number]: ChainAbi;
}

const posAbis: ChainMap = {
    4: pos_rinkeby,
    5: pos_goerli,
    42: pos_kovan,
    31337: localhost,
};

const utilAbis: ChainMap = {
    4: util_rinkeby,
    5: util_goerli,
    42: util_kovan,
    31337: localhost,
};

const tokenAbis: ChainMap = {
    4: token_rinkeby,
    5: token_goerli,
    42: token_kovan,
    31337: localhost,
};

const getAddress = (chainId: number, map: ChainMap, name: string): string => {
    const chain = map[chainId];
    if (!chain) {
        console.log(`Unsupported chain '${chainId}'`);
        return;
    }

    const contract = chain.contracts[name];
    if (!contract) {
        console.log(
            `No ${name} deployed at network ${chain.name} (${chainId})`
        );
        return;
    }

    const address = contract.address;
    console.log(
        `${name} resolved to address ${address} at network ${chain.name} (${chainId})`
    );
    return address;
};

function useContract<C>(
    connector: (address: string, signerOrProvider: Signer | Provider) => C,
    abis: ChainMap,
    name: string
): C {
    const { library, chainId } = useWeb3React<Web3Provider>();

    // contract is a state variable, because it's async
    const [contract, setContract] = useState<C>();

    // use an effect because it's async
    useEffect(() => {
        if (!library || !chainId) {
            // library or chainId not set yet, just return
            return;
        }

        // use provider signer
        const signer = library.getSigner();

        // try to resolve address
        const address = getAddress(chainId, abis, name);

        if (address) {
            // call the factory connector
            setContract(connector(address, signer));
        }
    }, [library, chainId]);

    return contract;
}

export const useStakingContract = (): StakingImpl => {
    return useContract(StakingImplFactory.connect, posAbis, 'StakingImpl');
};

export const useWorkerManagerContract = (): WorkerManagerAuthManagerImpl => {
    return useContract(
        WorkerManagerAuthManagerImplFactory.connect,
        utilAbis,
        'WorkerManagerAuthManagerImpl'
    );
};

export const useCartesiTokenContract = (): CartesiToken => {
    return useContract(
        CartesiToken__factory.connect,
        tokenAbis,
        'CartesiToken'
    );
};

export const usePoSContract = (): PoS => {
    return useContract(PoSFactory.connect, posAbis, 'PoS');
};
