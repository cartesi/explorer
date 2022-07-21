// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    VStack,
    HStack,
    Spinner,
    Button,
    Text,
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
    Types,
} from '../../graphql/hooks/usePoolActivities';
import { TableResponsiveHolder } from '../TableResponsiveHolder';
import { formatValue } from '../../utils/numberFormatter';
import Address from '../Address';
import { useWallet } from '../../contexts/wallet';

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
    chainId: number;
    type: string;
    amount: string;
}

const Activity: FC<ActivityProps> = memo(
    ({ index, accountId, chainId, timestamp, type, amount }) => {
        const formattedAmount = formatValue(amount, 'ctsi', ctsiFormatOptions);
        const formattedTime = dateTimeFormat.format(timestamp);

        return (
            <Tr key={index}>
                <Td>
                    <Address address={accountId} chainId={chainId} truncated />
                </Td>
                <Td>{formattedTime}</Td>
                <Td>{type}</Td>
                <Td>{formattedAmount} CTSI</Td>
            </Tr>
        );
    }
);

export interface IPoolActivityListProps {
    poolAddress: string;
    userSearch?: string;
    selectedTypes?: string[];
    selectedTimePeriod?: any;
}

export const PoolActivityList: FC<IPoolActivityListProps> = memo(
    ({ poolAddress, userSearch, selectedTypes, selectedTimePeriod }) => {
        const [timestamp, setTimestamp] = useState<number | null>();
        const [list, updateList] = useState(null);
        const { chainId } = useWallet();
        userSearch = userSearch === '' ? undefined : userSearch;

        const { activities, loading } = usePoolActivities({
            user: userSearch,
            pool: poolAddress,
            beforeInMillis: timestamp,
            from: selectedTimePeriod?.from,
            to: selectedTimePeriod?.to,
            types: selectedTypes as Types[],
        });

        useEffect(() => {
            setTimestamp(null);
            updateList(null);
        }, [userSearch, selectedTypes, selectedTimePeriod]);

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

        return (
            <>
                {list?.length > 0 && (
                    <TableResponsiveHolder>
                        <Table>
                            <Thead>
                                <Tr key="0">
                                    <Th>From</Th>
                                    <Th>Time</Th>
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
                                        chainId={chainId}
                                        timestamp={activity.timestamp}
                                        type={activity.type}
                                        amount={activity.amount}
                                    />
                                ))}
                            </Tbody>
                        </Table>
                    </TableResponsiveHolder>
                )}

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
