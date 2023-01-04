// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client';
import { useWallet } from '../../contexts/wallet';
import { useExtendedApollo } from '../../services/apollo';
import { PoolShareInfoExtendedData, StakingPoolsVars } from '../models';
import { POOL_SHARE_INFO_EXTENDED } from '../queries';

const usePoolShareInfoExtended = (id: string) => {
    const { chainId } = useWallet();
    const filter = id ? { id: id.toLowerCase() } : { id: '' };
    const client = useExtendedApollo(chainId);
    return useQuery<PoolShareInfoExtendedData, Partial<StakingPoolsVars>>(
        POOL_SHARE_INFO_EXTENDED,
        {
            variables: {
                where: filter,
            },
            notifyOnNetworkStatusChange: true,
            client,
            pollInterval: 600000, // Every 10 minutes
        }
    );
};

export default usePoolShareInfoExtended;
