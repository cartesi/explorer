// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { zeroAddress } from 'viem';
import { mulDiv } from '../../utils/bigint';

import { POOL_BALANCES } from '../queries';
import { PoolBalancesData, PoolBalancesVars } from '../models';

export const POOLS_PER_PAGE = 50;

const useTotalPoolBalance = (user: string) => {
    // filter by user. use address zero in case user is undefined so we get no balance
    const filter = { user: user?.toLowerCase() || zeroAddress };

    // state for total balance
    const [total, setTotal] = useState<bigint>(0n);

    // query all user balances
    const { data, refetch } = useQuery<PoolBalancesData, PoolBalancesVars>(
        POOL_BALANCES,
        {
            variables: {
                where: filter,
                skip: 0,
                first: POOLS_PER_PAGE, // XXX: consider only 50 first pools, ordered by shares
                orderBy: 'shares',
                orderDirection: 'desc',
            },
            notifyOnNetworkStatusChange: true,
        },
    );

    // aggregation of balances
    useEffect(() => {
        if (data) {
            refetch();
            // get user balance in all pools he is in, based on share value
            const amounts = data.poolBalances.map((b) =>
                mulDiv(
                    BigInt(b.shares),
                    BigInt(b.pool.amount),
                    BigInt(b.pool.shares),
                ),
            );
            // sum up all amounts in all pools
            setTotal(amounts.reduce((t, a) => t + a, 0n));
        }
    }, [data]);
    return total;
};

export default useTotalPoolBalance;
