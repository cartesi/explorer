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
import { BigNumber, FixedNumber } from '@ethersproject/bignumber';
import { constants } from 'ethers';

import { POOL_BALANCES } from '../queries';
import { PoolBalancesData, PoolBalancesVars } from '../models';

export const POOLS_PER_PAGE = 50;

const useTotalPoolBalance = (user: string) => {
    // filter by user. use address zero in case user is undefined so we get no balance
    const filter = { user: user?.toLowerCase() || constants.AddressZero };

    // state for total balance
    const [total, setTotal] = useState<BigNumber>(constants.Zero);

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
        }
    );

    // aggregation of balances
    useEffect(() => {
        if (data) {
            refetch();
            // get user balance in all pools he is in
            const amounts = data.poolBalances.map((b) => {
                const userShares = FixedNumber.from(b.shares);
                const poolShares = FixedNumber.from(b.pool.shares);
                const poolAmount = FixedNumber.from(b.pool.amount);

                if (poolShares.isZero()) {
                    return FixedNumber.from(0);
                }

                // calculate user amount based on share value
                const userAmount = userShares
                    .divUnsafe(poolShares)
                    .mulUnsafe(poolAmount);

                return userAmount;
            });
            // sum up all amounts in all pools
            const total = amounts.reduce(
                (t, a) => t.addUnsafe(a),
                FixedNumber.from(0)
            );
            setTotal(BigNumber.from(total).div(constants.WeiPerEther));
        }
    }, [data]);
    return total;
};

export default useTotalPoolBalance;
