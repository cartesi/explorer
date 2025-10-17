import { useQuery } from '@apollo/client/react';
import { getPastDaysInSeconds } from '../../utils/dateParser';
import {
    StakingPoolPerformanceData,
    StakingPoolPerformanceVars,
} from '../models';
import { STAKING_POOL_PERF } from '../queries/stakingPoolPerformance';

const useStakingPoolPerformance = (address: string) => {
    return useQuery<StakingPoolPerformanceData, StakingPoolPerformanceVars>(
        STAKING_POOL_PERF,
        {
            variables: {
                pool: address,
                orderDirection: 'desc',
                first: 2,
                monthlyOrderBy: 'timestamp',
                weeklyOrderBy: 'timestamp',
                whereMonthly: {
                    performance_not: 0,
                    timestamp_gte: getPastDaysInSeconds(60),
                },
                whereWeekly: {
                    performance_not: 0,
                    timestamp_gte: getPastDaysInSeconds(7),
                },
            },
        }
    );
};

export default useStakingPoolPerformance;
