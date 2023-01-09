// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Provider } from '@ethersproject/providers';
import { useWallet } from '@explorer/wallet';
import { Signer } from 'ethers';
import { useEffect, useState } from 'react';

import {
    CartesiToken,
    CartesiToken__factory,
    SimpleFaucet,
    SimpleFaucet__factory,
} from '@cartesi/token';
import {
    WorkerManagerAuthManagerImpl,
    WorkerManagerAuthManagerImpl__factory,
} from '@cartesi/util';

import util_goerli from '@cartesi/util/export/abi/goerli.json';
import util_mainnet from '@cartesi/util/export/abi/mainnet.json';

import token_goerli from '@cartesi/token/export/abi/goerli.json';
import token_mainnet from '@cartesi/token/export/abi/mainnet.json';

import localhost from './localhost.json';

import * as pool from './pool';
import * as pos from './pos';
import * as pos1 from './pos-1.0';

export interface ContractAbi {
    address: string;
    abi: any[];
}

export interface ContractMap {
    [name: string]: ContractAbi;
}

export interface ChainAbi {
    name: string;
    chainId: string;
    contracts: ContractMap;
}

export interface ChainMap {
    [chainId: number]: ChainAbi;
}

// Starts the local_abi with whatever we have locally.
const abi = {
    val: localhost,
    get localhost(): ChainAbi {
        return this.val;
    },
    set localhost(value: ChainAbi) {
        this.val = value;
    },
};

const utilAbis: ChainMap = {
    1: util_mainnet,
    5: util_goerli,
    31337: abi.localhost,
};

const tokenAbis: ChainMap = {
    1: token_mainnet,
    5: token_goerli,
    31337: abi.localhost,
};

export const getAddress = (
    chainId: number,
    map: ChainMap,
    name: string
): string => {
    const chain = map[chainId];
    if (!chain) {
        console.log(`Unsupported chain '${chainId}' for contract ${name}`);
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

export function useContract<C>(
    connector: (address: string, signerOrProvider: Signer | Provider) => C,
    abis: ChainMap,
    name: string
): C {
    const { library, chainId } = useWallet();

    // contract is a state variable, because it's async
    const [contract, setContract] = useState<C>();

    // use an effect because it's async
    useEffect(() => {
        if (!library || !chainId) {
            // library or chainId not set, reset to undefined
            setContract(undefined);
            return;
        }

        // use provider signer
        const signer = library.getSigner();

        // try to resolve address
        const address = getAddress(chainId, abis, name);

        if (address) {
            // call the factory connector
            setContract(connector(address, signer));
        } else {
            setContract(undefined);
        }
    }, [library, chainId]);

    return contract;
}

export function useContractFromAddress<C>(
    connector: (address: string, signerOrProvider: Signer | Provider) => C,
    address: string
): C {
    const { library, chainId } = useWallet();

    // contract is a state variable, because it's async
    const [contract, setContract] = useState<C>();

    // use an effect because it's async
    useEffect(() => {
        if (!library || !chainId || !address) {
            // library or chainId not set, reset to undefined
            setContract(undefined);
            return;
        }

        // use provider signer
        const signer = library.getSigner();

        // call the factory connector
        setContract(connector(address, signer));
    }, [library, chainId, address]);

    return contract;
}

export const useWorkerManagerContract = (): WorkerManagerAuthManagerImpl => {
    return useContract(
        WorkerManagerAuthManagerImpl__factory.connect,
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

export const useSimpleFaucetContract = (): SimpleFaucet => {
    return useContract(
        SimpleFaucet__factory.connect,
        tokenAbis,
        'SimpleFaucet'
    );
};

export const useStakingContract = pos.useStakingContract;
export const usePoSContract = pos.usePoSContract;
export const usePoS1Contract = pos1.usePoSContract;

export const useStakingPoolContract = pool.useStakingPoolContract;
export const useFeeContract = pool.useFeeContract;
export const useFlatRateCommissionContract = pool.useFlatRateCommissionContract;
export const useGasTaxCommissionContract = pool.useGasTaxCommissionContract;
export const useStakingPoolFactoryContract = pool.useStakingPoolFactoryContract;
