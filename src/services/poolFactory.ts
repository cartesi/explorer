// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';
import { useStakingPoolFactoryContract } from './contracts';
import { useBlockNumber } from './eth';
import { useTransaction } from './transaction';
import { ethers } from 'ethers';

export const useStakingPoolFactory = () => {
    const poolFactory = useStakingPoolFactoryContract();

    const { account } = useWeb3React<Web3Provider>();
    const blockNumber = useBlockNumber();

    const { waiting, error, setError, setTransaction } = useTransaction();
    const [paused, setPaused] = useState<boolean>(false);
    const [ready, setReady] = useState<boolean>(false);
    const [loading, setLoading] = useState<Boolean>(true);

    const createFlatRateCommission = (commission: number) => {
        if (poolFactory) {
            try {
                // send transaction
                setTransaction(
                    poolFactory.createFlatRateCommission(commission, {
                        value: BigNumber.from(10).pow(15),
                    })
                );
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const createGasTaxCommission = (gas: number) => {
        if (poolFactory) {
            try {
                // send transaction
                setTransaction(
                    poolFactory.createGasTaxCommission(gas, {
                        value: BigNumber.from(10).pow(15),
                    })
                );
            } catch (e) {
                setError(e.message);
            }
        }
    };

    // query paused flag
    useEffect(() => {
        if (poolFactory && account) {
            // read the paused flag
            poolFactory.paused().then((paused) => {
                setPaused(paused);

                // check if there is a reference pool set
                poolFactory.referencePool().then((referencePool) => {
                    setReady(referencePool != ethers.constants.AddressZero);

                    // finish loading
                    setLoading(false);
                });
            });
        }
    }, [poolFactory, account, blockNumber]);

    return {
        createFlatRateCommission,
        createGasTaxCommission,
        paused,
        ready,
        loading,
        error,
        waiting,
    };
};
