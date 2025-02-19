import { gql } from '@apollo/client';

export const STAKING_POOL_PERF = gql`
    query stakingPoolPerformance(
        $pool: ID!
        $first: Int
        $orderDirection: OrderDirection
        $weeklyOrderBy: WeeklyPoolPerformance_orderBy
        $monthlyOrderBy: MonthlyPoolPerformance_orderBy
        $whereMonthly: MonthlyPoolPerformance_filter
        $whereWeekly: WeeklyPoolPerformance_filter
    ) {
        performance: stakingPool(id: $pool) {
            weekly: weeklyPerformance(
                first: $first
                orderBy: $weeklyOrderBy
                orderDirection: $orderDirection
                where: $whereWeekly
            ) {
                shareValue
                performance
                timestamp
                id
            }
            monthly: monthlyPerformance(
                first: $first
                orderBy: $monthlyOrderBy
                orderDirection: $orderDirection
                where: $whereMonthly
            ) {
                shareValue
                id
                timestamp
                performance
            }
        }
    }
`;
