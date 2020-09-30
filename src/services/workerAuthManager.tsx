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

import { DataContext } from '../components/DataContext';

export const useWorkerAuthManager = (worker: string) => {
    const { library, chainId } = useWeb3React<Web3Provider>();

    const [authManager, setAuthManager] = useState<WorkerAuthManager>();

    const {
        setContext
    } = useContext(DataContext);

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

    const authorize = async (dapp: string) => {
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
    };
};
