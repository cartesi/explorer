import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { ALL_WORKERS } from '../queries/worker';
import { Worker } from '../models';

const useWorkers = () => {
    const [workers, setWorkers] = useState<Array<Worker>>([]);

    const { loading, error, data, fetchMore } = useQuery(ALL_WORKERS, {
        variables: {
            first: 10,
            where: { timestamp_gt: 0 },
            orderBy: 'timestamp',
            orderDirection: 'desc',
        },
        notifyOnNetworkStatusChange: true,
    });

    const refreshWorkers = async (continueLoading = true) => {
        let { data }: any = await fetchMore({
            variables: {
                lastIndex: continueLoading
                    ? {
                          timestamp_lt: workers[workers.length - 1].timestamp,
                      }
                    : {},
            },
        });

        if (data) {
            const newWorkers = _.unionBy(
                data.workers.map((worker) => ({
                    ...worker,
                    key: worker.id,
                })),
                workers,
                'key'
            );

            setWorkers(newWorkers.sort((a, b) => a.timestamp - b.timestamp));
        }
    };

    useEffect(() => {
        if (fetchMore && workers.length) {
            const interval = setInterval(() => {
                refreshWorkers(false);
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [fetchMore, workers]);

    useEffect(() => {
        if (!loading && !error && data) {
            const newWorkers = data.workers.map((worker) => {
                return {
                    ...worker,
                    key: worker.id,
                };
            });

            setWorkers(newWorkers.sort((a, b) => a.timestamp - b.timestamp));
        }
    }, [loading, error, data]);

    return {
        workers,
        refreshWorkers,
    };
};

export default useWorkers;
