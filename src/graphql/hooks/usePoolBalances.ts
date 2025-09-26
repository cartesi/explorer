// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client';
import { POOL_BALANCES } from '../queries';
import {
    PoolBalance,
    PoolBalancesData,
    PoolBalanceSort,
    PoolBalancesVars,
} from '../models';
import { FixedNumber } from '@ethersproject/bignumber';

export const POOLS_PER_PAGE = 50;

// return user pool share from 0 (0%) to 1 (100%)
export const userShare = (b: PoolBalance): number => {
    const userShares = FixedNumber.from(b.shares);
    const poolShares = FixedNumber.from(b.pool.shares);
    if (poolShares.isZero()) {
        return 0;
    }
    const share = userShares.divUnsafe(poolShares);
    return share.toUnsafeFloat();
};

const usePoolBalances = (
    user?: string,
    pageNumber = 0,
    sort: PoolBalanceSort = 'shares',
    perPage = POOLS_PER_PAGE,
    pool?: string
) => {
    const filter = {
        user: user?.toLowerCase() || undefined,
        pool: pool?.toLowerCase() || undefined,
    };

    return useQuery<PoolBalancesData, PoolBalancesVars>(POOL_BALANCES, {
        variables: {
            first: perPage,
            where: filter,
            skip: pageNumber * perPage,
            orderBy: sort,
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
    });
};

export default usePoolBalances;
