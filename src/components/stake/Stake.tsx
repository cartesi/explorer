// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

'use client';

import { Box, Heading, HStack, VStack } from '@chakra-ui/react';
import { constants } from 'ethers';
import { useState } from 'react';
import Layout, { PageBody, PagePanel } from '..//Layout';
import SearchInput from '../SearchInput';
import PoolPerformance from './PoolPerformance';
import PoolsOverview from './components/PoolsOverview';
import UserStakingPoolsTable from './tables/UserStakingPoolsTable';
import { useWallet } from '../wallet';
import usePoolBalances from '../../graphql/hooks/usePoolBalances';
import { POOLS_PER_PAGE } from '../../graphql/hooks/useStakingPools';
import useSummary from '../../graphql/hooks/useSummary';
import useTotalPoolBalance from '../../graphql/hooks/useTotalPoolBalance';
import { useColorModeValue } from '../ui/color-mode';

const StakeHomePage = () => {
    const { account, chainId, active } = useWallet();
    const summary = useSummary();
    const balances = usePoolBalances(account || constants.AddressZero);
    const poolBalance = useTotalPoolBalance(account);
    const stakingPoolsBg = useColorModeValue('white', 'dark.gray.primary');
    const [search, setSearch] = useState<string>();
    const pages = Math.ceil((summary?.totalPools || 0) / POOLS_PER_PAGE);
    const bg = useColorModeValue('gray.80', 'dark.gray.primary');
    const pageBg = useColorModeValue('gray.80', 'dark.gray.quaternary');
    const myStakingPoolsBg = useColorModeValue('white', 'dark.gray.primary');

    return (
        <Layout>
            <Box bg={bg}>
                <Box
                    w="100%"
                    bg="dark.gray.tertiary"
                    color="white"
                    px="6vw"
                    py={5}
                >
                    <Box color="white" px={{ base: '6vw', xl: '6vw' }}>
                        <Heading as="h1" fontSize={['4xl', '5xl']}>
                            Pools
                        </Heading>
                    </Box>
                </Box>

                <PagePanel darkModeColor="dark.gray.primary">
                    <PoolsOverview
                        balance={poolBalance}
                        summary={summary}
                        poolBalancesCount={balances.data?.poolBalances?.length}
                    />
                </PagePanel>

                <PageBody bg={pageBg} p={0}>
                    {active && (
                        <Box
                            shadow="md"
                            pt={[6, 6, 10]}
                            mt={[4, 4, 8]}
                            mb={[2, 2, 6]}
                            bg={myStakingPoolsBg}
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
                                    My Staking Pools
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

                            <VStack w="calc(100% - 1px)" pb={10}>
                                <PoolPerformance
                                    chainId={chainId}
                                    pages={pages}
                                    search={search}
                                />
                            </VStack>
                        </Box>
                    </Box>
                </PageBody>
            </Box>
        </Layout>
    );
};

export default StakeHomePage;
