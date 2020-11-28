// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { useBalance, useBlockNumber } from './eth';
import { usePoSContract, useWorkerManagerContract } from './contract';
import { BigNumberish, ContractTransaction } from 'ethers';

export const useWorkerManager = (address: string) => {
    const workerManager = useWorkerManagerContract();
    const pos = usePoSContract();

    const [error, setError] = useState<string>();
    const [transaction, setTransaction] = useState<
        Promise<ContractTransaction>
    >();
    const [user, setUser] = useState<string>('');
    const [owned, setOwned] = useState<boolean>(false);
    const [available, setAvailable] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const [retired, setRetired] = useState<boolean>(false);
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // make balance depend on owner, so if it changes we update the balance
    // also update on every block
    const block = useBlockNumber();
    const balance = useBalance(address, [user, block]);

    const updateState = async () => {
        if (workerManager) {
            const available = await workerManager.isAvailable(address);
            const owned = await workerManager.isOwned(address);
            const retired = await workerManager.isRetired(address);
            setAvailable(available);
            setOwned(owned);
            setRetired(retired);
            setPending(!available && !owned && !retired);
            setUser(await workerManager.getUser(address));
            setAuthorized(
                await workerManager.isAuthorized(address, pos.address)
            );
        }
    };

    useEffect(() => {
        if (workerManager) {
            setLoading(true);
            updateState()
                .then(() => setLoading(false))
                .catch((e) => setError(e.message));
        }
    }, [workerManager, address]);

    const hire = (value: BigNumberish) => {
        if (workerManager) {
            try {
                // send transaction
                const transaction = workerManager.hireAndAuthorize(
                    address,
                    pos.address,
                    {
                        value,
                    }
                );
                setTransaction(transaction);
                setError(undefined);
            } catch (e) {
                setError(e.message);
                setTransaction(undefined);
            }
        }
    };

    const cancelHire = () => {
        if (workerManager) {
            try {
                // send transaction
                const transaction = workerManager.cancelHire(address);
                setTransaction(transaction);
                setError(undefined);
            } catch (e) {
                setError(e.message);
                setTransaction(undefined);
            }
        }
    };

    const retire = () => {
        if (workerManager) {
            try {
                // send transaction
                const transaction = workerManager.retire(address);
                setTransaction(transaction);
                setError(undefined);
            } catch (e) {
                setTransaction(undefined);
                setError(error);
            }
        }
    };

    return {
        workerManager,
        balance,
        error,
        user,
        available,
        pending,
        owned,
        retired,
        authorized,
        loading,
        transaction,
        hire,
        cancelHire,
        retire,
    };
};
