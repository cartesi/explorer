// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect, useState } from 'react';
import { isAddress } from 'viem';
import { useWallet } from '../components/wallet';
import {
    asAddress,
    usePoS1Contract,
    usePoSContract,
    useWorkerManagerContract,
} from './contracts';
import { useBalance, useBlockNumber } from './eth';
import { Transaction, useTransaction } from './transaction';

export type NodeStatus = 'available' | 'owned' | 'retired' | 'pending' | 'none';
export interface Node {
    address: string;
    balance: bigint;
    user: string;
    available: boolean;
    pending: boolean;
    ready: boolean;
    owned: boolean;
    retired: boolean;
    authorized: boolean;
    authorized1: boolean;
    loading: boolean;
    transaction: Transaction<any>;
    error: string | null;
    hire: (amount: bigint) => void;
    authorize: () => void;
    cancelHire: () => void;
    retire: () => void;
    transfer: (amount: bigint) => void;
}

export const useNode = (address: string): Node => {
    const { walletClient, chainId } = useWallet();
    const workerManager = useWorkerManagerContract();
    const pos = usePoSContract();
    const pos1 = usePoS1Contract();

    const [user, setUser] = useState<string>('');
    const [owned, setOwned] = useState<boolean>(false);
    const [available, setAvailable] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const [retired, setRetired] = useState<boolean>(false);
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [authorized1, setAuthorized1] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [ready, setReady] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const transaction = useTransaction();

    // make balance depend on owner, so if it changes we update the balance
    // also update on every block
    const block = useBlockNumber();
    const balance = useBalance(address, [user, block]);

    const resetState = (address: string) => {
        setUser(address);
        setAvailable(false);
        setPending(false);
        setOwned(false);
        setRetired(false);
        setAuthorized(false);
        setAuthorized1(false);
        setReady(false);
    };

    const updateState = async (address: string) => {
        try {
            const worker = asAddress(address);
            const user = await workerManager.read.getUser([worker]);
            const available = await workerManager.read.isAvailable([worker]);
            const pending = await workerManager.read.isPending([worker]);
            const owned = await workerManager.read.isOwned([worker]);
            const retired = await workerManager.read.isRetired([worker]);
            const authorized = await workerManager.read.isAuthorized([
                worker,
                pos.address,
            ]);
            const authorized1 = pos1
                ? await workerManager.read.isAuthorized([worker, pos1.address])
                : false;

            setUser(user);
            setAvailable(available);
            setPending(pending);
            setOwned(owned);
            setRetired(retired);
            setAuthorized(authorized);
            setAuthorized1(authorized1);
            setReady(true);
            setError(null);
        } catch (e) {
            resetState('');
            setError(e.message);
        }
    };

    useEffect(() => {
        // when the address changes clean the state.
        resetState(address ?? '');
    }, [address]);

    useEffect(() => {
        if (workerManager) {
            setLoading(true);
            updateState(address).then(() => setLoading(false));
        }
    }, [workerManager, address, block]);

    const authorize = () => {
        if (workerManager) {
            transaction.set(
                workerManager.write.authorize([
                    asAddress(address),
                    pos.address,
                ]),
            );
        }
    };

    const hire = (value: bigint) => {
        if (workerManager) {
            transaction.set(
                workerManager.write.hireAndAuthorize(
                    [asAddress(address), pos.address],
                    { value },
                ),
            );
        }
    };

    const cancelHire = () => {
        if (workerManager) {
            transaction.set(
                workerManager.write.cancelHire([asAddress(address)]),
            );
        }
    };

    const retire = () => {
        if (workerManager) {
            transaction.set(workerManager.write.retire([asAddress(address)]));
        }
    };

    const transfer = (value: bigint) => {
        if (walletClient && chainId && address) {
            transaction.set(
                walletClient.sendTransaction({
                    to: asAddress(address),
                    value,
                    // viem's request typing needs strictNullChecks to resolve
                } as unknown as Parameters<
                    typeof walletClient.sendTransaction
                >[0]),
            );
        }
    };

    return {
        address: isAddress(address, { strict: false }) ? address : undefined,
        balance,
        user,
        available,
        pending,
        owned,
        retired,
        ready,
        authorized,
        authorized1,
        loading,
        transaction,
        error,
        hire,
        authorize,
        cancelHire,
        retire,
        transfer,
    };
};
