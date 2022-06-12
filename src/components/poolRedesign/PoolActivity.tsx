// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    //Box,
    VStack,
    HStack,
    Spinner,
    Button,
    Text,
    //FormControl,
    //FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    //Select,
    Stack,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import { FC, memo, useState, useEffect } from 'react';
import { last } from 'lodash/fp';
import usePoolActivities, {
    Activity as ActivityType,
} from '../../graphql/hooks/usePoolActivities';
import { PoolFilters } from './PoolFilters';
import { TableResponsiveHolder } from '../TableResponsiveHolder';
import { SearchIcon } from '@chakra-ui/icons';
//import Pagination from '../Pagination';
import { formatValue } from '../../utils/numberFormatter';
import Address from '../Address';

const ctsiFormatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
};

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
    hourCycle: 'h23',
    dateStyle: 'medium',
    timeStyle: 'short',
});

const Loader = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <VStack
            alignItems="center"
            spacing={4}
            w="full"
            textAlign="center"
            fontSize="sm"
        >
            <Spinner size="xl" />
            <Text>Loading staking activities with this pool</Text>
        </VStack>
    );
};

interface ActivityProps {
    index: number;
    accountId: string;
    timestamp: number;
    type: string;
    amount: string;
}

const Activity: FC<ActivityProps> = memo(
    ({ index, accountId, timestamp, type, amount }) => {
        const formattedAmount = formatValue(amount, 'ctsi', ctsiFormatOptions);
        const formattedTime = dateTimeFormat.format(timestamp);

        return (
            <Tr key={index}>
                <Td>
                    <Address address={accountId} truncated />
                </Td>
                <Td>{formattedTime}</Td>
                <Td>{type}</Td>
                <Td>{formattedAmount} CTSI</Td>
            </Tr>
        );
    }
);

interface IPoolActivityProps {
    poolAddress: string;
}

export const PoolActivity: FC<IPoolActivityProps> = memo(({ poolAddress }) => {
    const [selected, setSelected] = useState<string[]>([]);
    //const [pageNumber, setPageNumber] = useState<number>(0);

    const [timestamp, setTimestamp] = useState<number | null>();
    const [list, updateList] = useState(null);
    const { activities, loading } = usePoolActivities({
        pool: poolAddress,
        beforeInMillis: timestamp,
    });
    const oldestActivityTime =
        (list && last<ActivityType>(list)?.timestamp) || timestamp;

    const isAllActivitiesLoaded = timestamp === oldestActivityTime && !loading;

    useEffect(() => {
        if (null !== activities) {
            updateList((list) =>
                null !== list ? [...list, ...activities] : activities
            );
        }
    }, [activities]);

    console.log(list);

    const poolFilters = [
        {
            title: 'Types:',
            options: [
                { label: 'Stake', value: 'Stake' },
                { label: 'Unstake', value: 'Unstake' },
                { label: 'Deposit', value: 'Deposit' },
                { label: 'Withdraw', value: 'Withdraw' },
                { label: 'Blockes Produced', value: 'Block' },
                { label: 'Pool Activity', value: 'Pool' },
            ],
        },
        {
            title: 'Time Duration:',
            options: [
                { label: 'This Week', value: 'Week' },
                { label: 'This Month', value: 'Month' },
            ],
        },
        {
            title: 'User Types:',
            options: [
                { label: 'From', value: 'From' },
                { label: 'To', value: 'To' },
                { label: 'By', value: 'By' },
            ],
        },
    ];

    const onFilterChange = (value: string) => {
        const isSelected = selected.includes(value);
        if (isSelected) {
            setSelected(selected.filter((s) => s !== value));
        } else {
            setSelected([...selected, value]);
        }
        console.log(value);
    };

    return (
        <>
            <Stack
                mb={4}
                spacing={2}
                justify="space-between"
                align={{
                    base: 'flex-start',
                    lg: 'center',
                }}
                direction={{ base: 'column', lg: 'row' }}
            >
                <PoolFilters
                    onChange={onFilterChange}
                    filters={poolFilters}
                    selectedFilters={selected}
                />
                <InputGroup
                    w={{
                        base: '100%',
                        lg: 'auto',
                    }}
                    minW={{
                        base: 'unset',
                        lg: '20rem',
                    }}
                >
                    <InputLeftElement
                        pointerEvents="none"
                        children={<SearchIcon />}
                    />
                    <Input type="tel" placeholder="Search User Address..." />
                </InputGroup>
            </Stack>

            {list?.length > 0 && (
                <TableResponsiveHolder>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>From</Th>
                                <Th>Since</Th>
                                <Th>Type</Th>
                                <Th>Amount</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {list.map((activity, index) => (
                                <Activity
                                    index={index}
                                    accountId={activity.id}
                                    timestamp={activity.timestamp}
                                    type={activity.type}
                                    amount={activity.amount}
                                />
                            ))}
                        </Tbody>
                    </Table>
                </TableResponsiveHolder>
            )}

            {/* <Stack
                direction={{
                    base: 'column',
                    lg: 'row',
                }}
                spacing={{
                    base: 4,
                    lg: 8,
                }}
                justify={{
                    base: 'center',
                    lg: 'flex-end',
                }}
                align="center"
                mt={6}
            >
                <Box>
                    <FormControl
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <FormLabel htmlFor="pages" whiteSpace="nowrap">
                            Rows per page
                        </FormLabel>
                        <Select variant="outline" id="pages" w="auto">
                            <option>10</option>
                            <option>20</option>
                            <option>30</option>
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <Pagination
                        currentPage={pageNumber}
                        pages={20}
                        showPageNumbers
                        maxPageNumbers={5}
                        onPageClick={setPageNumber}
                    />
                </Box>
            </Stack> */}

            {list?.length > 0 && (
                <Stack spacing={8} mt={{ base: '6' }} alignItems="center">
                    <HStack justifyContent="flex-start" alignItems="center">
                        {!isAllActivitiesLoaded && (
                            <Button
                                variant="link"
                                colorScheme="blue"
                                isLoading={loading}
                                loadingText="Loading..."
                                onClick={() => setTimestamp(oldestActivityTime)}
                            >
                                <Text>Load more...</Text>
                            </Button>
                        )}
                        {isAllActivitiesLoaded && (
                            <Text color="gray.500">
                                All pool activities loaded
                            </Text>
                        )}
                    </HStack>
                </Stack>
            )}

            {!loading && list?.length === 0 && (
                <VStack
                    alignItems="center"
                    spacing={4}
                    w="full"
                    textAlign="center"
                    fontSize="sm"
                >
                    <Text mt={{ base: '6' }}>No pool activity to display.</Text>
                </VStack>
            )}

            {!list && <Loader isLoading={loading} />}
        </>
    );
});
