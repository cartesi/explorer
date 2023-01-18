// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    Flex,
    Heading,
    HStack,
    Select,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { isArray, isObject, uniqueId } from 'lodash';
import Layout from '../../../components/Layout';
import { PoolHeader } from '../../../components/stake/PoolHeader';
import { PoolBreadcrumbs } from '../../../components/stake/PoolBreadcrumbs';
import { useWallet } from '@explorer/wallet';
import useStakingPoolQuery from '../../../graphql/hooks/useStakingPool';
import UsersTable from '../../../components/stake/tables/UsersTable';
import Pagination from '../../../components/Pagination';
import usePoolBalances, {
    userShare,
} from '../../../graphql/hooks/usePoolBalances';
import {
    PoolBalance,
    PoolBalanceWithAccumulatedShares,
    StakingPoolUserHistory,
} from '../../../graphql/models';
import SearchInput from '../../../components/SearchInput';
import useStakingPoolUserHistories from '../../../graphql/hooks/useStakingPoolUserHistories';
import UsersChart from '../../../components/stake/UsersChart';
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

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
});

export interface AugmentedPoolBalance extends PoolBalance {
    accumulatedShares: string;
}

const PoolUsers = ({ formattedAddress }: ENSStaticProps) => {
    const bg = useColorModeValue('gray.80', 'header');
    const sectionBg = useColorModeValue('white', 'gray.800');
    const { account, chainId } = useWallet();
    const router = useRouter();
    const address = router.query.pool as string;
    const stakingPool = useStakingPoolQuery(address);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [search, setSearch] = useState<string | undefined>(undefined);
    const isManager = account && account.toLowerCase() === stakingPool?.manager;
    const poolCreationDate = DateTime.fromJSDate(
        new Date((stakingPool?.timestamp || 0) * 1000)
    );
    const today = DateTime.fromJSDate(new Date());
    const differenceInMonths = Math.ceil(
        today.diff(poolCreationDate, ['months']).get('months')
    );
    const monthsCount = Math.min(differenceInMonths, 4);
    const monthsLength = monthsCount > 0 ? monthsCount : 1;
    const monthOptions = useMemo(
        () =>
            Array.from({ length: monthsLength }).map((_, index) => {
                const date = DateTime.fromJSDate(new Date());
                const month = date.get('month');

                return {
                    id: uniqueId(),
                    date: date.set({ month: month - index }),
                };
            }),
        [monthsLength]
    );
    const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]);
    const [startTimestamp, setStartTimestamp] = useState<number>(
        DateTime.fromMillis(selectedMonth?.date.toMillis())
            .startOf('month')
            .toMillis()
    );
    const [endTimestamp, setEndTimestamp] = useState<number>(
        DateTime.fromMillis(selectedMonth?.date.toMillis())
            .endOf('month')
            .toMillis()
    );
    const [list, setList] = useState<PoolBalance[]>([]);
    const [userHistoriesList, setUserHistoriesList] = useState<
        StakingPoolUserHistory[]
    >([]);
    const [totalUsersPageNumber, setTotalUsersPageNumber] = useState<number>(0);
    const maxPerPage = 1000;
    const stakingPoolUserHistories = useStakingPoolUserHistories({
        pool: address,
        perPage: maxPerPage,
        startTimestamp,
        endTimestamp,
    });

    const totalUsers = stakingPool?.totalUsers || 0;
    const allBalances = usePoolBalances(
        undefined,
        totalUsersPageNumber,
        'shares',
        maxPerPage,
        address
    );
    const balances = usePoolBalances(
        search,
        pageNumber,
        'shares',
        rowsPerPage,
        address
    );
    const options = Array.from({ length: 3 }).map(
        (item, index) => (index + 1) * 10
    );
    const { poolBalances = [] } = balances.data ?? {};
    const totalPages = Math.ceil(totalUsers / rowsPerPage);

    const allBalancesData = useMemo(
        () =>
            list
                .map((balance) => ({
                    ...balance,
                    sharesPercent: userShare(balance),
                }))
                .reduce(
                    (accumulator, balance, index) => [
                        ...accumulator,
                        {
                            ...balance,
                            accumulatedSharesPercent:
                                index > 0
                                    ? accumulator[index - 1]
                                          .accumulatedSharesPercent +
                                      balance.sharesPercent
                                    : balance.sharesPercent,
                        },
                    ],
                    []
                ),
        [list]
    );

    const balancesData: PoolBalanceWithAccumulatedShares[] = useMemo(
        () =>
            poolBalances.map((balance) => {
                const item =
                    allBalancesData.find(
                        (d) => d.user.id === balance.user.id
                    ) ?? {};

                return {
                    ...balance,
                    ...item,
                };
            }),
        [poolBalances, allBalancesData]
    );

    useEffect(() => {
        if (isArray(allBalances.data?.poolBalances)) {
            setTotalUsersPageNumber((lastValue) =>
                allBalances.data.poolBalances.length === maxPerPage
                    ? lastValue + 1
                    : lastValue
            );

            setList((lastValue) => [
                ...lastValue,
                ...allBalances.data.poolBalances,
            ]);
        }
    }, [allBalances.data?.poolBalances, maxPerPage]);

    useEffect(() => {
        const nextValue = (
            stakingPoolUserHistories.data?.stakingPoolUserHistories ?? []
        ).reduce((accumulator, item) => {
            const itemDate = DateTime.fromMillis(item.timestamp * 1000);
            const existingItemWithMatchingDay: StakingPoolUserHistory =
                accumulator.find((existingItem) => {
                    const date = DateTime.fromMillis(
                        existingItem.timestamp * 1000
                    );
                    return date.toISODate() === itemDate.toISODate();
                });

            return isObject(existingItemWithMatchingDay)
                ? accumulator.map((existingItem) => ({
                      ...existingItem,
                      totalUsers:
                          existingItem.id === existingItemWithMatchingDay?.id
                              ? item.totalUsers
                              : existingItem.totalUsers,
                  }))
                : [...accumulator, item];
        }, []);

        setUserHistoriesList(nextValue);
    }, [stakingPoolUserHistories.data?.stakingPoolUserHistories]);

    return (
        <Layout>
            <PageHead
                title={`Pool users - ${formattedAddress}`}
                description={`Pool users - ${formattedAddress}`}
            />
            <PoolHeader isManager={isManager} from="users" />
            <PoolBreadcrumbs currentPage="Users" />

            <Box bg={bg}>
                <Box
                    bg={sectionBg}
                    mt={1}
                    pt={8}
                    pb={{ base: 6, md: 12 }}
                    px={{ base: '6vw', xl: '12vw' }}
                >
                    <Box w="100%">
                        <HStack justify="space-between" align="center" mb={6}>
                            <Heading as="h1" fontSize={['1xl', '2xl']}>
                                Total Users
                            </Heading>

                            {stakingPool?.totalUsers > 0 && (
                                <Select
                                    value={selectedMonth.id}
                                    width="10rem"
                                    borderLeft="none"
                                    borderTop="none"
                                    borderRight="none"
                                    borderRadius={0}
                                    fontSize={{
                                        base: 'xs',
                                        sm: 'sm',
                                        md: 'md',
                                    }}
                                    onChange={(event) => {
                                        const nextSelectedMonth =
                                            monthOptions.find(
                                                (month) =>
                                                    month.id ===
                                                    event.currentTarget.value
                                            );

                                        const nextStartTimestamp =
                                            DateTime.fromMillis(
                                                nextSelectedMonth?.date.toMillis()
                                            )
                                                .startOf('month')
                                                .toMillis();

                                        const nextEndTimestamp =
                                            DateTime.fromMillis(
                                                nextSelectedMonth?.date.toMillis()
                                            )
                                                .endOf('month')
                                                .toMillis();

                                        setSelectedMonth(nextSelectedMonth);
                                        setStartTimestamp(nextStartTimestamp);
                                        setEndTimestamp(nextEndTimestamp);
                                    }}
                                >
                                    {monthOptions.map((option) => (
                                        <option
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {dateTimeFormat.format(
                                                option.date.toMillis()
                                            )}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        </HStack>
                    </Box>

                    <UsersChart
                        data={userHistoriesList}
                        totalUsers={totalUsers}
                        month={selectedMonth.date}
                        loading={stakingPoolUserHistories.loading}
                    />
                </Box>

                <Box
                    bg={sectionBg}
                    mt={10}
                    px={{ base: '6vw', xl: '12vw' }}
                    py={{ base: 6, md: 10 }}
                >
                    <Box w="100%">
                        <HStack justify="space-between" align="center" mb={6}>
                            <Heading as="h1" fontSize={['1xl', '2xl']}>
                                Staking Users
                            </Heading>
                            <SearchInput
                                w={[100, 200, 400, 500]}
                                flex={{ base: 1, md: 'initial' }}
                                onSearchChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />
                        </HStack>

                        <UsersTable
                            chainId={chainId}
                            loading={balances.loading}
                            data={balancesData}
                        />

                        {!search &&
                            balancesData.length > 0 &&
                            totalPages > 1 && (
                                <Flex
                                    flexDirection={{
                                        base: 'column',
                                        md: 'row',
                                    }}
                                    justifyContent="flex-end"
                                    alignItems={{
                                        base: 'flex-end',
                                        md: 'flex-start',
                                    }}
                                    width="100%"
                                    mt="var(--chakra-space-12) !important"
                                    overflowX="auto"
                                    py={1}
                                >
                                    <HStack
                                        mr={{ base: 0, md: 12 }}
                                        mb={{ base: 4, md: 0 }}
                                    >
                                        <Text
                                            fontSize={{
                                                base: 'xs',
                                                sm: 'sm',
                                                md: 'md',
                                            }}
                                        >
                                            Rows per page
                                        </Text>
                                        <Select
                                            value={rowsPerPage}
                                            width="4.625rem"
                                            borderLeft="none"
                                            borderTop="none"
                                            borderRight="none"
                                            borderRadius={0}
                                            fontSize={{
                                                base: 'xs',
                                                sm: 'sm',
                                                md: 'md',
                                            }}
                                            onChange={(event) => {
                                                setRowsPerPage(
                                                    Number(
                                                        event.currentTarget
                                                            .value
                                                    )
                                                );
                                                setPageNumber(0);
                                            }}
                                        >
                                            {options.map((option) => (
                                                <option
                                                    key={`rows-per-page-${option}`}
                                                    value={option}
                                                >
                                                    {option}
                                                </option>
                                            ))}
                                        </Select>
                                    </HStack>

                                    <Pagination
                                        pages={totalPages}
                                        currentPage={pageNumber}
                                        showPageNumbers
                                        onPageClick={setPageNumber}
                                    />
                                </Flex>
                            )}
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
};

export default PoolUsers;
