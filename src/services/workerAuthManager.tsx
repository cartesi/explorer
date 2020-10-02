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
import { WorkerAuthManager } from '../contracts/WorkerAuthManager';
import { WorkerAuthManagerFactory } from '../contracts/WorkerAuthManagerFactory';
import { networks } from '../utils/networks';
import { ContractTransaction } from 'ethers';

export const useWorkerAuthManager = (worker: string, dapp: string) => {
    const { library, chainId } = useWeb3React<Web3Provider>();

    const [error, setError] = useState<string>();
    const [transaction, setTransaction] = useState<ContractTransaction>();
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [authManager, setAuthManager] = useState<WorkerAuthManager>();

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
                setError(`WorkerAuthManager not deployed at network '${chainId}'`);
            }
        }
    }, [library, chainId]);

    useEffect(() => {
        if (authManager) {
            authManager.isAuthorized(worker, dapp).then(setIsAuthorized);
        }
    }, [authManager, worker, dapp])

    const authorize = async () => {
        if (authManager) {
            try {
                // send transaction
                const transaction = await authManager.authorize(worker, dapp)
                setTransaction(transaction);
                setError(undefined);
            } catch (e) {
                setTransaction(undefined);
                setError(e.message);
            }
        }
    };

    return {
        authorize,
        isAuthorized,
        error,
        transaction,
    };
};
