// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
    HStack,
    Heading,
    Box,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { useFlag } from '@unleash/proxy-client-react';
import { useRouter } from 'next/router';
import Layout, {
    PageBody,
    PageHeader,
    PagePanel,
} from '../../components/Layout';
import useSummary from '../../graphql/hooks/useSummary';
import { useCartesiToken } from '../../services/token';
import { useBlockNumber } from '../../services/eth';
import { useWallet } from '../../contexts/wallet';
import SearchInput from '../../components/SearchInput';
import usePoolBalances from '../../graphql/hooks/usePoolBalances';
import PoolsOverview from '../../components/stake/components/PoolsOverview';
import UserStakingPools from '../../components/stake/UserStakingPoolsTable';
import { StakingPoolSortExtended } from '../../graphql/models';
import useStakingPoolsExtended from '../../graphql/hooks/useStakingPoolsExtended';
import Pagination from '../../components/Pagination';
import { POOLS_PER_PAGE } from '../../graphql/hooks/useStakingPools';
import PoolPerformanceExtendedTable from '../../components/stake/PoolPerformanceTable';
import PoolPerformanceExtended from '../../components/stake/PoolPerformanceExtended';
import PoolPerformance from '../../components/stake/PoolPerformance';

const Home = () => {
    const router = useRouter();

    // user account and blockchain information (from metamask or other wallets)
    const { account, chainId } = useWallet();

    // ethereum block number (from metamask)
    const blockNumber = useBlockNumber();

    // global summary information
    const summary = useSummary();

    const balances = usePoolBalances(account);
    const newPoolPageEnabled = useFlag('newPoolPageEnabled');
    const bg = useColorModeValue('gray.80', 'header');
    const bodyBg = useColorModeValue('gray.80', 'header');
    const stakingPoolsBg = useColorModeValue('white', 'gray.700');
    const [sort, setSort] = useState<StakingPoolSortExtended>(
        'commissionPercentage'
    );
    const [search, setSearch] = useState<string>();
    const [pageNumber, setPageNumber] = useState<number>(0);
    const { data: stakingPoolsData, loading } = useStakingPoolsExtended(
        pageNumber,
        search,
        sort
    );
    const pages = Math.ceil((summary?.totalPools || 0) / POOLS_PER_PAGE);
    const items = stakingPoolsData?.allStakingPools.nodes || [];
    const apr = useFlag('apr');
    const aws = useFlag('aws');

    useEffect(() => {
        // When the flag is off, the user is automatically redirected to /pool
        // The replace method overrides the current URL with the new one.
        if (!newPoolPageEnabled) {
            router.replace('/pool');
        }
    }, [newPoolPageEnabled, router]);

    return (
        <Layout>
            <Head>
                <title>Explorer - Pool List</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box bg={bg}>
                <PageHeader>
                    <Box
                        bg="header"
                        color="white"
                        px={{ base: '6vw', xl: '6vw' }}
                    >
                        <Heading as="h1" fontSize={['4xl', '5xl']}>
                            Pools
                        </Heading>
                    </Box>
                </PageHeader>

                <PagePanel>
                    <PoolsOverview />
                </PagePanel>

                <PageBody bg={bodyBg} mt={[4, 4, 8]} p={0}>
                    <Box
                        shadow="md"
                        pt={[6, 6, 10]}
                        mb={[2, 2, 6]}
                        bg={stakingPoolsBg}
                    >
                        <Box
                            px={{
                                sm: '0vw',
                                md: '12vw',
                                xl: '12vw',
                            }}
                            pb={[0, 0, 10]}
                        >
                            <Heading
                                as="h1"
                                fontSize={['1xl', '2xl']}
                                mb={6}
                                pl={[8, 8, 0]}
                            >
                                My staking pools
                            </Heading>
                            <UserStakingPools
                                chainId={chainId}
                                loading={balances.loading}
                                data={balances.data?.poolBalances || []}
                            />
                        </Box>
                    </Box>

                    <Box
                        shadow="md"
                        mt={[4, 4, 8]}
                        pt={[6, 6, 10]}
                        bg={stakingPoolsBg}
                    >
                        <Box
                            px={{
                                sm: '0vw',
                                md: '12vw',
                                xl: '12vw',
                            }}
                            pb={[0, 0, 10]}
                        >
                            <HStack
                                justify="space-between"
                                mb={6}
                                mr={[8, 8, 0]}
                                flexDirection={['column', 'row', 'row', 'row']}
                                alignItems={[
                                    'flex-start',
                                    'center',
                                    'center',
                                    'center',
                                ]}
                            >
                                <Heading
                                    as="h1"
                                    fontSize={['1xl', '2xl']}
                                    ml={[8, 8, 0]}
                                    mb={[4, 0, 0]}
                                >
                                    All Pools Performance
                                </Heading>
                                <SearchInput
                                    w={['calc(100% - 30px)', 200, 400, 400]}
                                    ml={['auto !important', 0, 0, 0]}
                                    placeholder="Search pool address..."
                                    onSearchChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                />
                            </HStack>

                            <VStack w="100%" pb={10}>
                                {apr && aws ? (
                                    <PoolPerformanceExtended
                                        chainId={chainId}
                                        pages={Math.ceil(
                                            (summary?.totalPools || 0) /
                                                POOLS_PER_PAGE
                                        )}
                                        account={account}
                                        search={search}
                                    />
                                ) : (
                                    <PoolPerformance
                                        chainId={chainId}
                                        pages={Math.ceil(
                                            (summary?.totalPools || 0) /
                                                POOLS_PER_PAGE
                                        )}
                                        account={account}
                                        search={search}
                                    />
                                )}
                            </VStack>
                        </Box>
                    </Box>
                </PageBody>
            </Box>
        </Layout>
    );
};

export default Home;
