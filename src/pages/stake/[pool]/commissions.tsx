// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex } from '@chakra-ui/react';
import { useFlag } from '@unleash/proxy-client-react';
import { isArray } from 'lodash';
import Layout from '../../../components/Layout';
import { PoolHeader } from '../../../components/stake/PoolHeader';
import { PoolBreadcrumbs } from '../../../components/stake/PoolBreadcrumbs';
import { useWallet } from '../../../contexts/wallet';
import useStakingPoolQuery from '../../../graphql/hooks/useStakingPool';
import useStakingPoolFeeHistories from '../../../graphql/hooks/useStakingPoolFeeHistories';
import PoolCommissionsTable from '../../../components/stake/tables/PoolCommissionsTable';
import Pagination from '../../../components/Pagination';
import { StakingPoolFeeHistory } from '../../../graphql/models';
import PerPageSelect from '../../../components/PerPageSelect';
import PageHead from '../../../components/PageHead';

import {
    Context,
    ENSStaticProps,
    getENSStaticProps,
    getPoolsStaticPaths,
} from '../../../utils/staticGeneration';

export async function getStaticPaths() {
    return getPoolsStaticPaths();
}

export async function getStaticProps(context: Context) {
    return getENSStaticProps(context);
}

const PoolCommissions = ({ formattedAddress }: ENSStaticProps) => {
    const router = useRouter();
    const address = router.query.pool as string;
    const stakingPoolCommissionPageEnabled = useFlag(
        'stakingPoolCommissionPageEnabled'
    );
    const { account } = useWallet();
    const stakingPool = useStakingPoolQuery(address);
    const [dataPageNumber, setDataPageNumber] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [list, setList] = useState<StakingPoolFeeHistory[]>([]);
    const isManager = account && account.toLowerCase() === stakingPool?.manager;
    const maxPerPage = 1000;
    const { data, loading } = useStakingPoolFeeHistories({
        pool: address,
        perPage: maxPerPage,
        pageNumber: dataPageNumber,
    });
    const startIndex = pageNumber * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedList = list.slice(startIndex, endIndex);
    const pages = Math.ceil(list.length / rowsPerPage);
    const perPageOptions = Array.from({ length: 3 }).map(
        (item, index) => (index + 1) * 10
    );

    useEffect(() => {
        if (!stakingPoolCommissionPageEnabled) {
            router.replace(`/stake/${address}`);
        }
    }, [stakingPoolCommissionPageEnabled, router, address]);

    useEffect(() => {
        if (isArray(data?.stakingPoolFeeHistories)) {
            setDataPageNumber((lastValue) =>
                data.stakingPoolFeeHistories.length === maxPerPage
                    ? lastValue + 1
                    : lastValue
            );

            setList((lastValue) => [
                ...lastValue,
                ...data.stakingPoolFeeHistories,
            ]);
        }
    }, [data?.stakingPoolFeeHistories, maxPerPage]);

    return (
        <Layout>
            <PageHead title={`Pool commissions - ${formattedAddress}`} />

            <PoolHeader isManager={isManager} from="commissions" />

            <PoolBreadcrumbs currentPage="Commissions" />

            <Box
                px={{ base: '6vw', xl: '12vw' }}
                py={{ base: 8, sm: 12, lg: 16 }}
            >
                <PoolCommissionsTable
                    data={paginatedList}
                    loading={list?.length === 0 && loading}
                />

                <Flex
                    flexDirection={{ base: 'column', md: 'row' }}
                    justifyContent="flex-end"
                    alignItems={{ base: 'flex-end', md: 'flex-start' }}
                    width="100%"
                    mt="var(--chakra-space-12) !important"
                    overflowX="auto"
                    py={1}
                >
                    {pages > 1 && (
                        <PerPageSelect
                            value={rowsPerPage}
                            options={perPageOptions}
                            onChange={(event) => {
                                setRowsPerPage(
                                    Number(event.currentTarget.value)
                                );
                                setPageNumber(0);
                            }}
                        />
                    )}

                    <Pagination
                        pages={pages}
                        currentPage={pageNumber}
                        showPageNumbers
                        onPageClick={setPageNumber}
                    />
                </Flex>
            </Box>
        </Layout>
    );
};

export default PoolCommissions;
