// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Button,
    HStack,
    Spinner,
    Stack,
    Table,
    Text,
    VStack,
} from '@chakra-ui/react';
import { last } from 'lodash/fp';
import { FC, memo, useEffect, useState } from 'react';
import usePoolActivities, {
    Activity as ActivityType,
    Types,
} from '../../graphql/hooks/usePoolActivities';
import theme from '../../styles/theme';
import { formatValue } from '../../utils/numberFormatter';
import Address from '../Address';
import { TableResponsiveHolder } from '../TableResponsiveHolder';
import { useWallet } from '../wallet';
import { useColorModeValue } from '../ui/color-mode';

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
            gap={4}
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
        const borderColor = useColorModeValue('gray.100', 'dark.gray.quinary');

        return (
            <Table.Row key={index}>
                <Table.Cell borderColor={borderColor}>
                    <Address address={accountId} chainId={chainId} truncated />
                </Table.Cell>
                <Table.Cell borderColor={borderColor}>
                    {formattedTime}
                </Table.Cell>
                <Table.Cell borderColor={borderColor}>{type}</Table.Cell>
                <Table.Cell borderColor={borderColor}>
                    {formattedAmount} CTSI
                </Table.Cell>
            </Table.Row>
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
        const headerColor = 'dark.gray.primary';
        const borderColor = useColorModeValue(
            'transparent',
            'dark.gray.quaternary'
        );
        const topBorderColor = useColorModeValue(
            'transparent',
            'dark.gray.quinary'
        );
        const loadMoreColor = useColorModeValue(
            'dark.secondary',
            'dark.primary'
        );

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
                    <TableResponsiveHolder
                        borderColor={borderColor}
                        borderWidth="1px"
                        borderRadius="6px"
                    >
                        <Table.Root>
                            <Table.Header>
                                <Table.Row
                                    key="0"
                                    fontFamily={theme.tokens.getVar(
                                        'fonts.body'
                                    )}
                                >
                                    <Table.Cell
                                        borderColor={topBorderColor}
                                        bg={headerColor}
                                        borderTopLeftRadius="6px"
                                    >
                                        From
                                    </Table.Cell>
                                    <Table.Cell
                                        borderColor={topBorderColor}
                                        bg={headerColor}
                                    >
                                        Time
                                    </Table.Cell>
                                    <Table.Cell
                                        borderColor={topBorderColor}
                                        bg={headerColor}
                                    >
                                        Type
                                    </Table.Cell>
                                    <Table.Cell
                                        borderColor={topBorderColor}
                                        bg={headerColor}
                                        borderTopRightRadius="6px"
                                    >
                                        Amount
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
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
                            </Table.Body>
                        </Table.Root>
                    </TableResponsiveHolder>
                )}

                {list?.length > 0 && (
                    <Stack gap={8} mt={{ base: '6' }} alignItems="center">
                        <HStack justifyContent="flex-start" alignItems="center">
                            {!isAllActivitiesLoaded && (
                                <Button
                                    variant="link"
                                    colorScheme="blue"
                                    isLoading={loading}
                                    loadingText="Loading..."
                                    color={loadMoreColor}
                                    textTransform="none"
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
                        gap={4}
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
