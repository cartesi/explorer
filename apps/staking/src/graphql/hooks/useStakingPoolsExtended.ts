// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client';
import { useWallet } from '@explorer/wallet';
import { useExtendedApollo } from '../../services/apollo';
import {
    StakingPoolSortExtended,
    StakingPoolsExtendedData,
    StakingPoolsExtendedVars,
} from '../models';
import { STAKING_POOLS_EXTENDED } from '../queries/stakingPoolsExtended';

export const POOLS_PER_PAGE = 50;

// sort directions for each criteria
const orderBy: Record<StakingPoolSortExtended, string> = {
    amount: 'AMOUNT_DESC',
    totalUsers: 'TOTAL_USERS_DESC',
    commissionPercentage: 'COMMISSION_PERCENTAGE_ASC',
    weekPerformance: 'WEEK_PERFORMANCE_DESC',
    monthPerformance: 'MONTH_PERFORMANCE_DESC',
};

const useStakingPoolsExtended = (
    pageNumber: number,
    id: string = undefined,
    sort: StakingPoolSortExtended = 'commissionPercentage'
) => {
    const { chainId } = useWallet();
    const filter = id ? { id: id.toLowerCase() } : {};
    const order = orderBy[sort];
    const client = useExtendedApollo(chainId);
    return useQuery<StakingPoolsExtendedData, StakingPoolsExtendedVars>(
        STAKING_POOLS_EXTENDED,
        {
            variables: {
                first: POOLS_PER_PAGE,
                where: filter,
                skip: pageNumber * POOLS_PER_PAGE,
                orderBy: order,
            },
            notifyOnNetworkStatusChange: true,
            client,
            pollInterval: 600000, // Every 10 minutes
        }
    );
};

export default useStakingPoolsExtended;
