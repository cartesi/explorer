// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useMemo } from 'react';
import {
    Abi,
    Account,
    Address,
    Chain,
    ContractFunctionArgs,
    ContractFunctionName,
    Hash,
    PublicClient,
    ReadContractReturnType,
    Transport,
    WalletClient,
} from 'viem';
import { useWallet } from '../../components/wallet';
import { networks } from '../../utils/networks';
import {
    cartesiTokenAbi,
    cartesiTokenAddress,
    simpleFaucetAbi,
    simpleFaucetAddress,
    workerManagerAuthManagerAbi,
    workerManagerAuthManagerAddress,
} from './generated';
import * as pool from './pool';
import * as pos from './pos';
import * as pos1 from './pos-1.0';

export type ContractClients = {
    public: PublicClient<Transport, Chain>;
    wallet: WalletClient<Transport, Chain, Account>;
};

type ReadFunctions<T extends Abi> = {
    [name in ContractFunctionName<T, 'pure' | 'view'>]: (
        args?: ContractFunctionArgs<T, 'pure' | 'view', name>,
    ) => Promise<ReadContractReturnType<T, name>>;
};

type WriteFunctions<T extends Abi> = {
    [name in ContractFunctionName<T, 'nonpayable' | 'payable'>]: (
        args?: ContractFunctionArgs<T, 'nonpayable' | 'payable', name>,
        options?: { value?: bigint },
    ) => Promise<Hash>;
};

/**
 * Contract instance (`read.*` / `write.*`) typed by its ABI. viem's own
 * `GetContractReturnType` needs `strictNullChecks`, which the project does not
 * enable, so the surface is built from the ABI-level types instead.
 */
export type Contract<T extends Abi> = {
    address: Address;
    abi: T;
    read: ReadFunctions<T>;
    write: WriteFunctions<T>;
};

/**
 * Reads go through `readContract`; writes are simulated first so a revert is
 * reported with the contract's reason (through `extractErrorMessage`) before
 * the wallet is asked to sign, like the previous gas estimation did.
 */
const createContract = <const T extends Abi>(
    abi: T,
    address: Address,
    client: ContractClients,
): Contract<T> => {
    const read = new Proxy({} as ReadFunctions<T>, {
        get: (_, functionName: string) => (args?: readonly unknown[]) =>
            client.public.readContract({
                address,
                abi,
                functionName,
                args,
            } as never),
    });
    const write = new Proxy({} as WriteFunctions<T>, {
        get:
            (_, functionName: string) =>
            async (args?: readonly unknown[], options?: { value?: bigint }) => {
                const { request } = await client.public.simulateContract({
                    address,
                    abi,
                    functionName,
                    args,
                    account: client.wallet.account,
                    ...options,
                } as never);
                return client.wallet.writeContract(request as never);
            },
    });
    return { address, abi, read, write };
};

/** Deployment address per chain id, as written by `pnpm gen:abi`. */
export type AddressMap = Readonly<Record<number, Address>>;

export const asAddress = (value?: string): Address | undefined =>
    value ? (value as Address) : undefined;

export const getContractAddress = (
    chainId: number | undefined,
    addresses: AddressMap,
    name: string,
): Address | undefined => {
    if (!chainId) {
        return undefined;
    }
    const network = networks[chainId] ?? chainId;
    const address = addresses[chainId];
    if (!address) {
        console.log(`No ${name} deployed at network ${network} (${chainId})`);
        return undefined;
    }
    console.log(
        `${name} resolved to address ${address} at network ${network} (${chainId})`,
    );
    return address;
};

/** Contract at an explicit address; available only while connected to a supported network. */
export function useContractFromAddress<const T extends Abi>(
    abi: T,
    address?: Address,
): Contract<T> | undefined {
    const { publicClient, walletClient, chainId } = useWallet();

    return useMemo(() => {
        if (!publicClient || !walletClient || !chainId || !address) {
            return undefined;
        }
        return createContract(abi, address, {
            public: publicClient,
            wallet: walletClient,
        });
    }, [abi, address, chainId, publicClient, walletClient]);
}

/** Contract resolved from the deployment address map for the connected chain. */
export function useContract<const T extends Abi>(
    abi: T,
    addresses: AddressMap,
    name: string,
): Contract<T> | undefined {
    const { chainId } = useWallet();
    return useContractFromAddress(
        abi,
        getContractAddress(chainId, addresses, name),
    );
}

export const useWorkerManagerContract = () =>
    useContract(
        workerManagerAuthManagerAbi,
        workerManagerAuthManagerAddress,
        'WorkerManagerAuthManagerImpl',
    );

export const useCartesiTokenContract = () =>
    useContract(cartesiTokenAbi, cartesiTokenAddress, 'CartesiToken');

export const useSimpleFaucetContract = () =>
    useContract(simpleFaucetAbi, simpleFaucetAddress, 'SimpleFaucet');

export const useStakingContract = pos.useStakingContract;
export const usePoSContract = pos.usePoSContract;
export const usePoS1Contract = pos1.usePoSContract;

export const useStakingPoolContract = pool.useStakingPoolContract;
export const useFeeContract = pool.useFeeContract;
export const useFlatRateCommissionContract = pool.useFlatRateCommissionContract;
export const useStakingPoolFactoryContract = pool.useStakingPoolFactoryContract;
