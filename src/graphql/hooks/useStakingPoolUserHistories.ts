// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client/react';
import { STAKING_POOL_USER_HISTORIES } from '../queries';
import { UsersVars, StakingPoolUserHistory } from '../models';
import { toUnixTimestamp } from '../../utils/dateParser';

export interface UseStakingPoolFeeHistoriesOptions {
    pool?: string;
    startTimestamp: number;
    endTimestamp: number;
    pageNumber?: number;
    perPage?: number;
}

export interface UseStakingPoolFeeHistoriesFilter {
    pool?: string;
    timestamp_gte: number;
    timestamp_lte: number;
}

const useStakingPoolUserHistories = (
    options: UseStakingPoolFeeHistoriesOptions
) => {
    const {
        pool,
        startTimestamp,
        endTimestamp,
        pageNumber = 0,
        perPage = 20,
    } = options;
    const filter: UseStakingPoolFeeHistoriesFilter = {
        timestamp_gte: toUnixTimestamp(startTimestamp),
        timestamp_lte: toUnixTimestamp(endTimestamp),
    };

    if (pool) {
        filter.pool = pool.toLowerCase();
    }

    return useQuery<
        { stakingPoolUserHistories: StakingPoolUserHistory[] },
        UsersVars
    >(STAKING_POOL_USER_HISTORIES, {
        variables: {
            first: perPage,
            skip: pageNumber * perPage,
            where: filter,
            orderBy: 'timestamp',
            orderDirection: 'asc',
        },
        notifyOnNetworkStatusChange: true,
    });
};

export default useStakingPoolUserHistories;
