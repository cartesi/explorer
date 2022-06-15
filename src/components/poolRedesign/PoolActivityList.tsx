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
import { TableResponsiveHolder } from '../TableResponsiveHolder';
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

interface IPoolActivityListProps {
    poolAddress: string;
    userSearch?: string;
}

export const PoolActivityList: FC<IPoolActivityListProps> = memo(
    ({ poolAddress, userSearch }) => {
        //const [pageNumber, setPageNumber] = useState<number>(0);
        const [timestamp, setTimestamp] = useState<number | null>();
        const [list, updateList] = useState(null);

        userSearch = userSearch === '' ? undefined : userSearch;

        const { activities, loading } = usePoolActivities({
            user: userSearch,
            pool: poolAddress,
            beforeInMillis: timestamp,
        });

        useEffect(() => {
            setTimestamp(null);
            updateList(null);
        }, [userSearch]);

        const oldestActivityTime =
            (list && last<ActivityType>(list)?.timestamp) || timestamp;

        const isAllActivitiesLoaded =
            timestamp === oldestActivityTime && !loading;

        useEffect(() => {
            if (null !== activities) {
                updateList((list) =>
                    null !== list ? [...list, ...activities] : activities
                );
            }
        }, [activities]);

        console.log(activities);

        return (
            <>
                {list?.length > 0 && (
                    <TableResponsiveHolder>
                        <Table>
                            <Thead>
                                <Tr key="0">
                                    <Th>From</Th>
                                    <Th>Since</Th>
                                    <Th>Type</Th>
                                    <Th>Amount</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {list.map((activity, index) => (
                                    <Activity
                                        key={index}
                                        index={index}
                                        accountId={activity.user.id}
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
                                    onClick={() =>
                                        setTimestamp(oldestActivityTime)
                                    }
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
                        <Text mt={{ base: '6' }}>
                            No pool activity to display.
                        </Text>
                    </VStack>
                )}

                {!list && <Loader isLoading={loading} />}
            </>
        );
    }
);
