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
import { PoolActivitiesVars, PoolActivitiesData } from '../models';
import { GET_POOL_ACTIVITIES } from '../queries/poolActivities';
import { PoolActivity } from '../models';
import { pipe, map, getOr, capitalize } from 'lodash/fp';

interface Activity extends Omit<PoolActivity, 'timestamp' | 'type'> {
    timestamp: number;
    type: string;
}
interface UsePoolActivitiesProps {
    user?: string;
    pool?: string;
    beforeInMillis?: number;
}
interface UsePoolActivities {
    activities: Activity[] | null;
    loading: boolean;
    error?: Error;
}

const getPoolActivities = (val: PoolActivitiesData): PoolActivity[] =>
    getOr([], 'poolActivities', val);

const normalize = map((val: PoolActivity): Activity => {
    const { type, timestamp: timestampAsString, ...rest } = val;
    const timestamp = parseInt(timestampAsString) * 1000;
    return {
        ...rest,
        timestamp,
        type: capitalize(type),
    };
});

/**
 * Receive the graphQL response and apply a small transformation to the timestamp from string to number
 * and from unix timestamp to milliseconds.
 *  PS: There is no fail-safe against strings been passed down since
 *  that will never happen in this context.
 */
const transform = pipe(getPoolActivities, normalize);

/**
 * Converts the time in milisseconds to seconds (unix timestamp).
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#get_the_number_of_seconds_since_the_ecmascript_epoch
 * @param numberInMillis
 * @returns
 */
const milliToUnixTimestamp = (numberInMillis: number): number =>
    Math.floor(numberInMillis / 1000);
/**
 * Hook retrieves withdrawals, deposits, stakes and unstakes based on a user, pool or
 * a combination of both. It gets the first twenty entries ordered and filtered
 * by the timestamp passed as argument (i.e. beforeInMillis) or
 * it use the current timestamp i.e. Date.now() as the default entry.
 * @param {UsePoolActivitiesProps}
 * @returns {UsePoolActivities}
 */
const usePoolActivities = ({
    beforeInMillis,
    user,
    pool,
}: UsePoolActivitiesProps): UsePoolActivities => {
    const timestamp_lt = milliToUnixTimestamp(beforeInMillis || Date.now());
    const where = { user, pool, timestamp_lt };
    const orderBy = 'timestamp';
    const orderDirection = 'desc';
    const first = 20;
    const [activities, setActivities] = useState(null);
    const { data, loading, error } = useQuery<
        PoolActivitiesData,
        PoolActivitiesVars
    >(GET_POOL_ACTIVITIES, {
        variables: {
            where,
            orderBy,
            orderDirection,
            first,
        },
        notifyOnNetworkStatusChange: true,
        pollInterval: 600000,
    });

    useEffect(() => {
        data && setActivities(transform(data));
    }, [data]);

    return { activities, loading, error };
};

export default usePoolActivities;
