// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { isAddress } from '@ethersproject/address';
import { BigNumber, BigNumberish } from 'ethers';
import { useEffect, useState } from 'react';
import { useWallet } from '../components/wallet';
import {
    usePoS1Contract,
    usePoSContract,
    useWorkerManagerContract,
} from './contracts';
import { useBalance, useBlockNumber } from './eth';
import { Transaction, useTransaction } from './transaction';

export type NodeStatus = 'available' | 'owned' | 'retired' | 'pending' | 'none';
export interface Node {
    address: string;
    balance: BigNumber;
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
    hire: (amount: BigNumberish) => void;
    authorize: () => void;
    cancelHire: () => void;
    retire: () => void;
    transfer: (amount: BigNumberish) => void;
}

export const useNode = (address: string): Node => {
    const { library, chainId } = useWallet();
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
            const user = await workerManager.getUser(address);
            const available = await workerManager.isAvailable(address);
            const pending = await workerManager.isPending(address);
            const owned = await workerManager.isOwned(address);
            const retired = await workerManager.isRetired(address);
            const authorized = await workerManager.isAuthorized(
                address,
                pos.address
            );
            const authorized1 = pos1
                ? await workerManager.isAuthorized(address, pos1.address)
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
            transaction.set(workerManager.authorize(address, pos.address));
        }
    };

    const hire = (value: BigNumberish) => {
        if (workerManager) {
            transaction.set(
                workerManager.hireAndAuthorize(address, pos.address, {
                    value,
                })
            );
        }
    };

    const cancelHire = () => {
        if (workerManager) {
            transaction.set(workerManager.cancelHire(address));
        }
    };

    const retire = () => {
        if (workerManager) {
            transaction.set(workerManager.retire(address));
        }
    };

    const transfer = (value: BigNumberish) => {
        if (library && chainId && address) {
            const signer = library.getSigner();
            transaction.set(signer.sendTransaction({ to: address, value }));
        }
    };

    return {
        address: isAddress(address) ? address : undefined,
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
