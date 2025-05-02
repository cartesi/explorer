// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

'use client';

import {
    Box,
    createListCollection,
    Flex,
    Heading,
    HStack,
    Portal,
    Select,
} from '@chakra-ui/react';
import { isArray, isObject, uniqueId } from 'lodash';
import { DateTime } from 'luxon';
import { useParams } from 'next/navigation';
import React, { FC, useEffect, useMemo, useState } from 'react';
import Layout from '../Layout';
import Pagination from '../Pagination';
import PerPageSelect from '../PerPageSelect';
import SearchInput from '../SearchInput';
import { PoolBreadcrumbs } from './PoolBreadcrumbs';
import { PoolHeader } from './PoolHeader';
import UsersTable from './tables/UsersTable';
import UsersChart from './UsersChart';
import { useWallet } from '../wallet';
import usePoolBalances, {
    userShare,
} from '../../graphql/hooks/usePoolBalances';
import useStakingPoolQuery from '../../graphql/hooks/useStakingPool';
import useStakingPoolUserHistories from '../../graphql/hooks/useStakingPoolUserHistories';
import {
    PoolBalance,
    PoolBalanceWithAccumulatedShares,
    StakingPoolUserHistory,
} from '../../graphql/models';
import { useDebounce } from '../../hooks/useDebounce';
import { useColorModeValue } from '../ui/color-mode';

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
});

const PoolUsers: FC = () => {
    const pageBg = useColorModeValue('white', 'dark.gray.quaternary');
    const bg = useColorModeValue('gray.80', 'dark.gray.quaternary');
    const sectionBg = useColorModeValue('white', 'dark.gray.primary');
    const { account, chainId } = useWallet();
    const params = useParams();
    const address = params.pool as string;
    const stakingPool = useStakingPoolQuery(address);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>(
        undefined
    );
    const handleDebouncedSearch = useDebounce(setDebouncedSearch);
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
        debouncedSearch,
        debouncedSearch ? 0 : pageNumber,
        'shares',
        rowsPerPage,
        address
    );
    const options = Array.from({ length: 3 }).map(
        (_, index) => (index + 1) * 10
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

    const selectOptions = createListCollection({
        items: monthOptions.map((option) => ({
            label: dateTimeFormat.format(option.date.toMillis()),
            value: option.id,
        })),
    });

    /*
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
     */

    return (
        <Layout bg={pageBg}>
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
                            <Heading as="h1" fontSize={['xl', '2xl']}>
                                Total Users
                            </Heading>

                            {stakingPool?.totalUsers > 0 && (
                                <Select.Root
                                    value={[selectedMonth.id]}
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
                                    onValueChange={({ value }) => {
                                        const nextSelectedMonth =
                                            monthOptions.find(
                                                (month) => month.id === value[0]
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
                                    collection={selectOptions}
                                    size="sm"
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                        <Select.Trigger>
                                            <Select.ValueText />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Portal>
                                        <Select.Positioner>
                                            <Select.Content>
                                                {selectOptions.items.map(
                                                    (option) => (
                                                        <Select.Item
                                                            key={option.value}
                                                            item={option}
                                                        >
                                                            {option.label}
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    )
                                                )}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Portal>
                                </Select.Root>
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
                            <Heading as="h1" fontSize={['xl', '2xl']}>
                                Staking Users
                            </Heading>
                            <SearchInput
                                w={[100, 200, 400, 500]}
                                flex={{ base: 1, md: 'initial' }}
                                onSearchChange={(e) =>
                                    handleDebouncedSearch(e.target.value)
                                }
                            />
                        </HStack>

                        <UsersTable
                            chainId={chainId}
                            loading={balances.loading}
                            data={balancesData}
                        />

                        {!debouncedSearch &&
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
                                        md: 'center',
                                    }}
                                    width="100%"
                                    mt={12}
                                    overflowX="auto"
                                    py={1}
                                >
                                    <PerPageSelect
                                        value={rowsPerPage}
                                        options={options}
                                        onChange={(value) => {
                                            setRowsPerPage(Number(value));
                                            setPageNumber(0);
                                        }}
                                    />

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
