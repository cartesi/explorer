// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useState } from 'react';
import { VStack } from '@chakra-ui/react';

import useStakingPools from '../../graphql/hooks/useStakingPools';
import { StakingPoolSort } from '../../graphql/models';
import { Pagination } from '@explorer/ui';
import PoolPerformanceTable from './tables/PoolPerformanceTable';

interface PoolPerformanceProps {
    chainId: number;
    pages: number;
    search?: string;
}

const PoolPerformance: FC<PoolPerformanceProps> = ({
    chainId,
    pages,
    search,
}) => {
    const [sort, setSort] = useState<StakingPoolSort>('commissionPercentage');
    const [pageNumber, setPageNumber] = useState<number>(0);
    const { data, loading } = useStakingPools({
        sort,
        pageNumber,
        where: {
            id: search,
        },
    });

    return (
        <VStack w="100%">
            <PoolPerformanceTable
                chainId={chainId}
                loading={loading}
                data={data?.stakingPools || []}
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

export default PoolPerformance;
