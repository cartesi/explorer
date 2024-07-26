// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client';
import { toPairs } from 'lodash';
import { filter, isEmpty, pipe, reduce } from 'lodash/fp';
import { getPastDaysInSeconds } from '../../utils/dateParser';
import {
    OrderDirection,
    StakingPoolSort,
    StakingPoolsData,
    StakingPoolsVars,
} from '../models';
import { STAKING_POOLS } from '../queries/stakingPools';

export const POOLS_PER_PAGE = 50;

type TupleOf<T> = T extends never
    ? never
    : { [K in keyof T]: [string, T[K]] }[Extract<keyof T, string>];

type WhereClause = { manager?: string; id?: string };

interface UseStakingPoolProps {
    sort?: StakingPoolSort;
    pageNumber?: number;
    where?: WhereClause;
}

// sort directions for each criteria
const directions: Record<string, OrderDirection> = {
    totalUsers: 'desc',
    amount: 'desc',
    commissionPercentage: 'asc',
};

const reducer = (
    prev: WhereClause,
    [k, v]: TupleOf<WhereClause>
): WhereClause => {
    return {
        ...prev,
        [k]: v.toLowerCase(),
    };
};

const notEmptyValues = ([, v]) => !isEmpty(v);

const valuesToLowerCase: (a: WhereClause) => WhereClause = pipe(
    toPairs,
    filter(notEmptyValues),
    reduce(reducer, {} as WhereClause)
);

const useStakingPools = ({
    sort = 'commissionPercentage',
    where,
    pageNumber = 0,
}: UseStakingPoolProps = {}) => {
    const filter = valuesToLowerCase(where);
    return useQuery<StakingPoolsData, StakingPoolsVars>(STAKING_POOLS, {
        variables: {
            first: POOLS_PER_PAGE,
            where: filter,
            skip: pageNumber * POOLS_PER_PAGE,
            orderBy: sort,
            orderDirection: directions[sort],
            firstMonthlyPerf: 2,
            firstWeeklyPerf: 2,
            monthlyOrderBy: 'timestamp',
            weeklyOrderBy: 'timestamp',
            monthlyOrderDirection: 'desc',
            weeklyOrderDirection: 'desc',
            whereMonthly: {
                performance_not: 0,
                timestamp_gte: getPastDaysInSeconds(60),
            },
            whereWeekly: {
                performance_not: 0,
                timestamp_gte: getPastDaysInSeconds(7),
            },
        },
        notifyOnNetworkStatusChange: true,
    });
};

export default useStakingPools;
