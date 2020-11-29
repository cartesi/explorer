// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { BigNumberish } from 'ethers';
import { isAddress } from '@ethersproject/address';
import { useWeb3React } from '@web3-react/core';
import { useBalance, useBlockNumber } from './eth';
import { usePoSContract, useWorkerManagerContract } from './contract';
import { confirmations } from '../utils/networks';

export const useNode = (address: string) => {
    const { library, chainId } = useWeb3React();
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
    const [transfering, setTransfering] = useState(false);

    // make balance depend on owner, so if it changes we update the balance
    // also update on every block
    const block = useBlockNumber();
    const balance = useBalance(address, [user, block]);

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
            setUser(user);
            setAvailable(available);
            setPending(pending);
            setOwned(owned);
            setRetired(retired);
            setAuthorized(authorized);
        } catch (e) {
            setUser('');
            setAvailable(false);
            setPending(false);
            setOwned(false);
            setRetired(false);
            setAuthorized(false);
        }
    };

    useEffect(() => {
        if (workerManager) {
            setLoading(true);
            updateState(address)
                .then(() => setLoading(false))
                .catch((e) => setError(e.message));
        }
    }, [workerManager, address, block, hiring]);

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

    const transfer = (value: BigNumberish) => {
        if (library && chainId && address) {
            setTransfering(true);
            const signer = library.getSigner();
            signer.sendTransaction({ to: address, value }).then((tx) => {
                tx.wait(confirmations[chainId]).then((receipt) => {
                    setTransfering(false);
                });
            });
        }
    };

    return {
        address: isAddress(address) ? address : undefined,
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
        transfering,
        hire,
        cancelHire,
        retire,
        transfer,
    };
};
