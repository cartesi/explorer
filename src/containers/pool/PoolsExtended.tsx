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

import useStakingPoolsExtended from '../../graphql/hooks/useStakingPoolsExtended';
import PoolTableExtended from '../../components/pools/PoolTableExtended';
import { StakingPoolSortExtended } from '../../graphql/models';
import Pagination from '../../components/Pagination';

interface PoolsExtendedProps {
    chainId: number;
    account?: string;
    pages: number;
    search?: string;
}

const PoolsExtended: FC<PoolsExtendedProps> = ({
    chainId,
    account,
    pages,
    search,
}) => {
    const [sort, setSort] = useState<StakingPoolSortExtended>(
        'commissionPercentage'
    );
    const [pageNumber, setPageNumber] = useState<number>(0);
    const { data, loading } = useStakingPoolsExtended(pageNumber, search, sort);

    return (
        <VStack w="100%">
            <PoolTableExtended
                chainId={chainId}
                account={account}
                loading={loading}
                data={data?.allStakingPools.nodes || []}
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

export default PoolsExtended;
