// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { parseUnits } from '@ethersproject/units';
import { usePoSContract, useWorkerManagerContract } from './contract';
import { ContractTransaction } from 'ethers';

export const useWorkerManager = (worker: string) => {
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
    const [loading, setLoading] = useState<boolean>(false);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    const updateState = async () => {
        if (workerManager) {
            const available = await workerManager.isAvailable(worker);
            const owned = await workerManager.isOwned(worker);
            const retired = await workerManager.isRetired(worker);
            setAvailable(available);
            setOwned(owned);
            setRetired(retired);
            setPending(!available && !owned && !retired);
            setUser(await workerManager.getUser(worker));
            setIsAuthorized(
                await workerManager.isAuthorized(worker, pos.address)
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
    }, [workerManager, worker]);

    const hire = () => {
        if (workerManager) {
            // XXX: move this to a parameter
            const value = parseUnits('1', 'finney');

            try {
                // send transaction
                const transaction = workerManager.hireAndAuthorize(
                    worker,
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
                const transaction = workerManager.cancelHire(worker);
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
                const transaction = workerManager.retire(worker);
                setTransaction(transaction);
                setError(undefined);
            } catch (e) {
                setTransaction(undefined);
                setError(error);
            }
        }
    };

    const clearStates = () => {
        // setError(null);
        setTransaction(null);
    };

    return {
        workerManager,
        error,
        user,
        available,
        pending,
        owned,
        retired,
        isAuthorized,
        loading,
        transaction,
        updateState,
        clearStates,
        hire,
        cancelHire,
        retire,
    };
};
