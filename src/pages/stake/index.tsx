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
import { useWallet } from '../../contexts/wallet';
import SearchInput from '../../components/SearchInput';
import usePoolBalances from '../../graphql/hooks/usePoolBalances';
import PoolsOverview from '../../components/stake/components/PoolsOverview';
import UserStakingPoolsTable from '../../components/stake/tables/UserStakingPoolsTable';
import { POOLS_PER_PAGE } from '../../graphql/hooks/useStakingPools';
import PoolPerformanceExtended from '../../components/stake/PoolPerformanceExtended';
import PoolPerformance from '../../components/stake/PoolPerformance';
import useTotalPoolBalance from '../../graphql/hooks/useTotalPoolBalance';

const Home = () => {
    const router = useRouter();
    const { account, chainId, active } = useWallet();
    const summary = useSummary();
    const balances = usePoolBalances(account);
    const poolBalance = useTotalPoolBalance(account);
    const newPoolListPageEnabled = useFlag('newPoolListPageEnabled');
    const bg = useColorModeValue('gray.80', 'header');
    const bodyBg = useColorModeValue('gray.80', 'header');
    const stakingPoolsBg = useColorModeValue('white', 'gray.700');
    const [search, setSearch] = useState<string>();
    const apr = useFlag('apr');
    const aws = useFlag('aws');
    const pages = Math.ceil((summary?.totalPools || 0) / POOLS_PER_PAGE);

    useEffect(() => {
        if (!newPoolListPageEnabled) {
            router.replace('/pools');
        }
    }, [newPoolListPageEnabled, router]);

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
                    <PoolsOverview
                        balance={poolBalance}
                        summary={summary}
                        poolBalancesCount={balances.data?.poolBalances?.length}
                    />
                </PagePanel>

                <PageBody bg={bodyBg} p={0}>
                    {active && (
                        <Box
                            shadow="md"
                            pt={[6, 6, 10]}
                            mt={[4, 4, 8]}
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
                                <UserStakingPoolsTable
                                    chainId={chainId}
                                    loading={balances.loading}
                                    data={balances.data?.poolBalances || []}
                                    account={account}
                                />
                            </Box>
                        </Box>
                    )}

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
                                        pages={pages}
                                        account={account}
                                        search={search}
                                    />
                                ) : (
                                    <PoolPerformance
                                        chainId={chainId}
                                        pages={pages}
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
