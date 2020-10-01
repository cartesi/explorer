// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { WorkerAuthManager } from '../contracts/WorkerAuthManager';
import { WorkerAuthManagerFactory } from '../contracts/WorkerAuthManagerFactory';
import { networks } from '../utils/networks';

import { TransactionContext } from '../components/TransactionContext';

export const useWorkerAuthManager = (worker: string, dapp: string) => {
    const { library, chainId } = useWeb3React<Web3Provider>();

    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [authManager, setAuthManager] = useState<WorkerAuthManager>();

    const {
        submitting,
        setContext
    } = useContext(TransactionContext);

    // create the WorkerAuthManager, asynchronously
    useEffect(() => {
        if (library && chainId) {
            const network = networks[chainId];
            const workerAuthManagerArtifact = require(`@cartesi/util/deployments/${network}/WorkerAuthManagerImpl.json`);
            const address = workerAuthManagerArtifact?.address;
            if (address) {
                console.log(
                    `Attaching WorkerAuthManager to address '${address}' deployed at network '${chainId}'`
                );
                setAuthManager(
                    WorkerAuthManagerFactory.connect(address, library.getSigner())
                );
            } else {
                setContext({
                    error: `WorkerAuthManager not deployed at network '${chainId}'`
                });
            }
        }
    }, [library, chainId]);

    const updateState = async (
        authManager: WorkerAuthManager,
        worker: string,
        dapp: string
    ) => {
        if (authManager) {
            const isAuthorized = await authManager.isAuthorized(worker, dapp);
            setIsAuthorized(isAuthorized);
        }
    }

    useEffect(() => {
        if (authManager) {
            updateState(authManager, worker, dapp);
        }
    }, [submitting, authManager, worker, dapp])

    const authorize = async () => {
        if (authManager) {
            try {
                // send transaction
                const transaction = await authManager.authorize(worker, dapp)
                setContext({
                    error: null,
                    submitting: true,
                    currentTransaction: transaction
                });
            } catch (e) {
                setContext({
                    error: e.message,
                    submitting: false
                });
            }
        }
    };

    return {
        authorize,
        isAuthorized
    };
};
