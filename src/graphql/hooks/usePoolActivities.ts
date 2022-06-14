// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client';
import { capitalize, getOr, isEmpty, map, pipe } from 'lodash/fp';
import { useEffect, useState } from 'react';
import { toUnixTimestamp } from '../../utils/dateParser';
import {
    ActivityType,
    PoolActivitiesData,
    PoolActivitiesVars,
    PoolActivity,
} from '../models';
import { GET_POOL_ACTIVITIES } from '../queries/poolActivities';

export interface Activity extends Omit<PoolActivity, 'timestamp' | 'type'> {
    timestamp: number;
    type: string;
}

export type Types = `${ActivityType}`;
interface UsePoolActivitiesProps {
    user?: string;
    pool?: string;
    beforeInMillis?: number;
    from?: Date | number;
    to?: Date | number;
    types?: Types[];
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
 * Hook retrieves withdrawals, deposits, stakes and unstakes based
 * on a few component API properties. Note. from prop has precedence over
 * beforeInMillis props so choose one or the other.
 * @param {UsePoolActivitiesProps}
 * @returns {UsePoolActivities}
 */
const usePoolActivities = ({
    beforeInMillis,
    user,
    pool,
    from,
    to,
    types,
}: UsePoolActivitiesProps): UsePoolActivities => {
    const where: any = { user, pool };
    if (beforeInMillis) {
        where.timestamp_lt = toUnixTimestamp(beforeInMillis);
    }

    if (from) {
        where.timestamp_gt = toUnixTimestamp(from);
    }

    if (to) {
        where.timestamp_lt = toUnixTimestamp(to);
    }

    if (!isEmpty(types)) {
        where.type_in = types;
    }

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
