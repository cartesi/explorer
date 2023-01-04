// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useStakingPoolFactoryContract } from './contracts';
import { useBlockNumber } from './eth';
import { useTransaction } from './transaction';
import { useWallet } from '../contexts/wallet';

export const useStakingPoolFactory = () => {
    const poolFactory = useStakingPoolFactoryContract();

    const { account } = useWallet();
    const blockNumber = useBlockNumber();

    const transaction = useTransaction<string>((receipt) => {
        // result is pool address taken from transaction event
        if (receipt.events) {
            const event = receipt.events.find(
                (e) =>
                    e.event == 'NewFlatRateCommissionStakingPool' ||
                    e.event == 'NewGasTaxCommissionStakingPool'
            );
            if (event && event.args && event.args.length > 0) {
                return event.args[0];
            }
        }
    });
    const [paused, setPaused] = useState<boolean>(false);
    const [ready, setReady] = useState<boolean>(false);
    const [loading, setLoading] = useState<Boolean>(true);

    const createFlatRateCommission = (commission: number) => {
        if (poolFactory) {
            transaction.set(
                poolFactory.createFlatRateCommission(commission, {
                    value: ethers.utils.parseEther('0.001'),
                })
            );
        }
    };

    const createGasTaxCommission = (gas: number) => {
        if (poolFactory) {
            transaction.set(
                poolFactory.createGasTaxCommission(gas, {
                    value: ethers.utils.parseEther('0.001'),
                })
            );
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
        loading,
        paused,
        ready,
        transaction,
    };
};
