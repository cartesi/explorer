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
import { BigNumberish } from 'ethers';
import { confirmations } from '../utils/networks';
import { useWeb3React } from '@web3-react/core';

export const useNode = (address: string) => {
    const { chainId } = useWeb3React();
    const workerManager = useWorkerManagerContract();
    const pos = usePoSContract();

    const [error, setError] = useState<string>();
    const [user, setUser] = useState<string>('');
    const [owned, setOwned] = useState<boolean>(false);
    const [available, setAvailable] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const [retired, setRetired] = useState<boolean>(false);
    const [authorized, setAuthorized] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [hiring, setHiring] = useState<boolean>(false);

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
    }, [workerManager, address, block]);

    const hire = (value: BigNumberish) => {
        if (workerManager) {
            // send transaction
            setHiring(true);
            setError(undefined);
            workerManager
                .hireAndAuthorize(address, pos.address, {
                    value,
                })
                .then((tx) => {
                    tx.wait(confirmations[chainId])
                        .then((receipt) => {
                            setHiring(false);
                            setError(undefined);
                            updateState();
                        })
                        .catch((e) => {
                            setHiring(false);
                            setError(e.message);
                        });
                })
                .catch((e) => {
                    setHiring(false);
                    setError(e.message);
                });
        }
    };

    const cancelHire = () => {
        if (workerManager) {
            // send transaction
            workerManager
                .cancelHire(address)
                .then((tx) => {
                    tx.wait(confirmations[chainId])
                        .then((receipt) => {
                            setHiring(false);
                            setError(undefined);
                            updateState();
                        })
                        .catch((e) => {
                            setHiring(false);
                            setError(e.message);
                        });
                })
                .catch((e) => {
                    setHiring(false);
                    setError(e.message);
                });
        }
    };

    const retire = () => {
        if (workerManager) {
            // send transaction
            workerManager
                .retire(address)
                .then((tx) => {
                    tx.wait(confirmations[chainId])
                        .then((receipt) => {
                            setHiring(false);
                            setError(undefined);
                            updateState();
                        })
                        .catch((e) => {
                            setHiring(false);
                            setError(e.message);
                        });
                })
                .catch((e) => {
                    setHiring(false);
                    setError(e.message);
                });
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
        hiring,
        hire,
        cancelHire,
        retire,
    };
};
