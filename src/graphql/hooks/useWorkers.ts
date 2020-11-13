import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { WORKERS } from '../queries/worker';
import { Worker } from '../models';

const useWorkers = () => {
    const [workers, setWorkers] = useState<Array<Worker>>([]);

    const [lastTimestamp, setLastTimestamp] = useState(0);
    const [firstTimestamp, setFirstTimestamp] = useState(0);

    const [where, setWhere] = useState<any>({ timestamp_gt: 0 });

    const { loading, error, data, fetchMore } = useQuery(WORKERS, {
        variables: {
            first: 10,
            where,
            orderBy: 'timestamp',
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
    });

    const refreshWorkers = async (
        pageOffset: number = 0,
        newId: string = null
    ) => {
        let newWhere: any =
            pageOffset === -2
                ? {
                      timestamp_gt: 0,
                  }
                : pageOffset === 1
                ? {
                      timestamp_lt: lastTimestamp,
                  }
                : {
                      timestamp_gt: firstTimestamp,
                  };

        if (newId && newId != '') {
            newWhere = {
                ...newWhere,
                id: newId,
            };
        }

        setWhere(newWhere);
    };

    useEffect(() => {
        if (!loading && !error && data) {
            const newWorkers = data.workers.map((worker) => {
                return {
                    ...worker,
                    key: worker.id,
                };
            });

            setWorkers(newWorkers.sort((a, b) => b.timestamp - a.timestamp));
        }
    }, [loading, error, data]);

    useEffect(() => {
        if (workers.length > 1) {
            setFirstTimestamp(workers[0].timestamp);
            setLastTimestamp(workers[workers.length - 1].timestamp);
        }
    }, [workers]);

    return {
        workers,
        refreshWorkers,
    };
};

export default useWorkers;
