// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { BigNumber } from '@ethersproject/bignumber';
import { useStakingPoolFactoryContract } from './contracts';
import { useTransaction } from './transaction';

export const useStakingPoolFactory = () => {
    const poolFactory = useStakingPoolFactoryContract();

    const { waiting, error, setError, setTransaction } = useTransaction();

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

    return {
        createFlatRateCommission,
        createGasTaxCommission,
        error,
        waiting,
    };
};
