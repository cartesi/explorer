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
import { WorkerManager } from '../contracts/WorkerManager';
import { WorkerManagerFactory } from '../contracts/WorkerManagerFactory';
import { parseUnits } from '@ethersproject/units';
import { networks } from '../utils/networks';
import { ContractTransaction } from 'ethers';

export const useWorkerManager = (worker: string) => {
    const { library, chainId } = useWeb3React<Web3Provider>();
    const [workerManager, setWorkerManager] = useState<WorkerManager>();

    const [error, setError] = useState<string>();
    const [transaction, setTransaction] = useState<Promise<ContractTransaction>>();
    const [user, setUser] = useState<string>('');
    const [owned, setOwned] = useState<boolean>(false);
    const [available, setAvailable] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const [retired, setRetired] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // create the WorkerManager, asynchronously
    useEffect(() => {
        if (library && chainId) {
            const network = networks[chainId];
            const address = require(`@cartesi/util/deployments/${network}/WorkerManagerImpl.json`)?.address;
            if (!address) {
                setError(`WorkerManager not deployed at network '${chainId}'`);
                return;
            }
            console.log(
                `Attaching WorkerManager to address '${address}' deployed at network '${chainId}'`
            );
            setWorkerManager(
                WorkerManagerFactory.connect(address, library.getSigner())
            );
        }
    }, [library, chainId]);

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
                const transaction = workerManager.hire(worker, {
                    value,
                });
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
        loading,
        transaction,
        updateState,
        clearStates,
        hire,
        cancelHire,
        retire,
    };
};

export const useUserWorkers = (worker: string, user: string) => {
    const { workerManager } = useWorkerManager(worker);
    const [workers, setWorkers] = useState<string[]>([]);

    useEffect(() => {
        if (workerManager) {
            Promise.all([
                workerManager.queryFilter(
                    workerManager.filters.JobAccepted(null, user)
                ),
                workerManager.queryFilter(
                    workerManager.filters.Retired(null, user)
                ),
            ]).then(([hires, retires]) => {
                // merge claim and release events into a single list
                // and sort by block number
                const events = [...hires, ...retires].sort(
                    (a, b) => a.blockNumber - b.blockNumber
                );

                // build final list of proxies considering every claim and release event
                // in history for the user
                const proxies = events.reduce((array: string[], ev) => {
                    const args: any = ev.args;
                    const worker = args.worker;
                    if (ev.event === 'JobAccepted') {
                        array.push(worker);
                    } else if (ev.event === 'Retired') {
                        array.splice(array.indexOf(worker), 1);
                    }
                    return array;
                }, []);
                setWorkers(workers);
            });
        }
    }, [workerManager, user]);

    return workers;
};
