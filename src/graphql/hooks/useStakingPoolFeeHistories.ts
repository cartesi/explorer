// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client';
import { STAKING_POOL_FEE_HISTORIES } from '../queries';
import { UsersVars, StakingPoolFeeHistory } from '../models';

export interface UseStakingPoolFeeHistoriesOptions {
    pageNumber?: number;
    perPage?: number;
    pool?: string;
}

export interface UseStakingPoolFeeHistoriesFilter {
    pool?: string;
}

const useStakingPoolFeeHistories = (
    options: UseStakingPoolFeeHistoriesOptions
) => {
    const { pool = undefined, pageNumber = 0, perPage = 20 } = options;
    const filter: UseStakingPoolFeeHistoriesFilter = {};

    if (pool) {
        filter.pool = pool.toLowerCase();
    }

    return useQuery<
        { stakingPoolFeeHistories: StakingPoolFeeHistory[] },
        UsersVars
    >(STAKING_POOL_FEE_HISTORIES, {
        variables: {
            first: perPage,
            skip: pageNumber * perPage,
            where: filter,
            orderBy: 'timestamp',
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
    });
};

export default useStakingPoolFeeHistories;
