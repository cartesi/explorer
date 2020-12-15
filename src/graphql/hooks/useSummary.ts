import { useQuery } from '@apollo/client';
import { SUMMARY } from '../queries/summary';
import { Summary, SummaryData, SummaryVars } from '../models';

const useSummary = (): Summary => {
    const { data } = useQuery<SummaryData, SummaryVars>(SUMMARY, {
        variables: {
            id: '1',
        },
        notifyOnNetworkStatusChange: true,
        pollInterval: 600000,
    });

    return data?.summary;
};

export default useSummary;
