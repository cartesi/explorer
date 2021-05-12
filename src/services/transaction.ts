import { ContractTransaction } from 'ethers';
import { useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { confirmations } from '../utils/networks';

export const useTransaction = () => {
    const { chainId } = useWeb3React<Web3Provider>();

    const [waiting, setWaiting] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [transaction, setTransaction] =
        useState<Promise<ContractTransaction>>();

    useEffect(() => {
        if (transaction) {
            setWaiting(true);
            setError(null);

            transaction
                .then((tx) => {
                    tx.wait(confirmations[chainId])
                        .then(() => {
                            setError(null);
                        })
                        .catch((e) => {
                            setError(e.message);
                        })
                        .finally(() => {
                            setWaiting(false);
                        });
                })
                .catch((e) => {
                    setError(e.message);
                    setWaiting(false);
                });
        }
    }, [transaction]);

    return {
        waiting,
        error,
        setError,
        setTransaction,
    };
};
