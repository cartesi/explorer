import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { SUMMARY } from '../queries/summary';
import { Summary, SummaryData, SummaryVars } from '../models';

const useSummary = () => {
    const [summary, setSummary] = useState<Summary>();

    const { loading, error, data, fetchMore } = useQuery<
        SummaryData,
        SummaryVars
    >(SUMMARY, {
        variables: {
            id: '1',
        },
        notifyOnNetworkStatusChange: true,
    });

    const refreshSummary = async () => {
        let { data }: any = await fetchMore({
            variables: {
                id: 1,
            },
        });

        if (data) {
            setSummary(data.summary);
        }
    };

    useEffect(() => {
        if (fetchMore && summary) {
            const interval = setInterval(() => {
                refreshSummary();
            }, 60000);

            return () => clearInterval(interval);
        }
    }, [fetchMore, summary]);

    useEffect(() => {
        if (!loading && !error && data) {
            setSummary(data.summary);
        }
    }, [loading, error, data]);

    return {
        summary,
        refreshSummary,
    };
};

export default useSummary;
