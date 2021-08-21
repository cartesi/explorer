// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useState } from 'react';
import { useBreakpointValue, VStack } from '@chakra-ui/react';

import useStakingPools from '../../graphql/hooks/useStakingPools';
import PoolTable from '../../components/pools/PoolTable';
import { StakingPoolSort } from '../../graphql/models';
import Pagination from '../../components/Pagination';

interface PoolsProps {
    chainId: number;
    account?: string;
    pages: number;
    search?: string;
}

const Pools: FC<PoolsProps> = ({ chainId, account, pages, search }) => {
    const [sort, setSort] = useState<StakingPoolSort>('totalUsers');
    const [pageNumber, setPageNumber] = useState<number>(0);
    const { data, loading } = useStakingPools(pageNumber, search, sort);
    const size = useBreakpointValue(['sm', 'sm', 'md', 'lg']);

    return (
        <VStack w="100%">
            <PoolTable
                chainId={chainId}
                account={account}
                loading={loading}
                data={data?.stakingPools || []}
                size={size as 'lg' | 'md' | 'sm'}
                sort={sort}
                onSort={(order) => setSort(order)}
            />
            {!search && (
                <Pagination
                    pages={pages}
                    currentPage={pageNumber}
                    onPageClick={setPageNumber}
                />
            )}
        </VStack>
    );
};

export default Pools;
