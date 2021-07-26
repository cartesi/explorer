// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client';
import { STAKING_POOLS } from '../queries/stakingPools';
import { StakingPoolsData, StakingPoolsVars, StakingPoolSort } from '../models';

export const POOLS_PER_PAGE = 50;

const useStakingPools = (
    pageNumber: number,
    id: string = undefined,
    sort: StakingPoolSort = 'totalUsers'
) => {
    const filter = id ? { id: id.toLowerCase() } : {};
    return useQuery<StakingPoolsData, StakingPoolsVars>(STAKING_POOLS, {
        variables: {
            first: POOLS_PER_PAGE,
            where: filter,
            skip: pageNumber * POOLS_PER_PAGE,
            orderBy: sort,
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
        pollInterval: 600000, // Every 10 minutes
    });
};

export default useStakingPools;
