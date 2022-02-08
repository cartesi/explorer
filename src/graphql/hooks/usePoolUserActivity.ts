// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { PoolUserActivityVars, PoolUserActivityData } from '../models';
import { GET_POOL_USER_ACTIVITY } from '../queries/poolUserActivity';
import { PoolUserActivity } from '../models';
import { values, flatten, pipe, orderBy, map } from 'lodash/fp';

enum ActivityType {
    'PoolWithdraw' = 'Withdraw',
    'PoolDeposit' = 'Deposit',
    'PoolStake' = 'Stake',
    'PoolUnstake' = 'Unstake',
}
interface Activity extends Omit<PoolUserActivity, 'timestamp'> {
    type: ActivityType;
    timestamp: number;
}

interface UsePoolUserActivity {
    activities: Activity[] | null;
    loading: boolean;
    error?: Error;
}

const getAndFlattenValues = (val: PoolUserActivityData): PoolUserActivity[] =>
    flatten(values(val));

const normalize = map((val: PoolUserActivity): Activity => {
    const { __typename, timestamp: timestampAsString, ...rest } = val;
    const timestamp = parseInt(timestampAsString) * 1000;
    return {
        ...rest,
        __typename,
        timestamp,
        type: ActivityType[__typename] || __typename,
    };
});

const orderByLatestActivity = (val: Activity[]): Activity[] =>
    orderBy(['timestamp'], ['desc'], val);

/**
 * Receive the graphQL response and transform it to a single list with some
 * transformation applied, also order by the most recent activity.
 *
 *  PS: There is no fail-safe against strings been passed down since
 *  that will never happen in this context.
 *
 */
const aggregate = pipe(getAndFlattenValues, normalize, orderByLatestActivity);

/**
 * Return withdrawals, deposits, stakes and unstakes of a user on a specific pool or
 * not passing a pool will return all activities related to that user in different pools
 * @param user user Account
 * @param pool pool Address
 * @returns { UsePoolUserActivity }
 */
const usePoolUserActivity = (
    user: string,
    pool?: string
): UsePoolUserActivity => {
    if (!user) {
        return { loading: false, activities: null };
    }

    const filter = { user, pool };
    const [activities, setActivities] = useState(null);
    const { data, loading, error } = useQuery<
        PoolUserActivityData,
        PoolUserActivityVars
    >(GET_POOL_USER_ACTIVITY, {
        variables: {
            depositFilter: filter,
            unstakeFilter: filter,
            stakeFilter: filter,
            withdrawFilter: filter,
        },
        notifyOnNetworkStatusChange: true,
        pollInterval: 600000,
    });

    useEffect(() => {
        data && setActivities(aggregate(data));
    }, [data]);

    return { activities, loading, error };
};

export default usePoolUserActivity;
