// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Heading,
    HStack,
    Spinner,
    Text,
    VStack,
    Button,
    useColorModeValue,
} from '@chakra-ui/react';
import React, { FC, memo, useState, useEffect } from 'react';
import { last } from 'lodash/fp';
import { CheckCircleIcon, EmptyTransactionIcon } from '@explorer/ui';
import usePoolActivities, {
    Activity as ActivityType,
} from '../../graphql/hooks/usePoolActivities';
import { formatValue } from '../../utils/numberFormatter';

export interface Props {
    userAccount: string;
    poolAddress: string;
}

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
    amount: string;
    type: string;
    timestamp: number;
}

const Activity: FC<ActivityProps> = memo(({ amount, type, timestamp }) => {
    const formattedAmount = formatValue(amount, 'ctsi', ctsiFormatOptions);
    const headerContent = `${type} ${formattedAmount} CTSI`;
    const formattedTime = dateTimeFormat.format(timestamp);
    const timeColor = useColorModeValue('gray.400', 'white');

    return (
        <Box>
            <Heading as="h4" size="sm" fontWeight={600}>
                {headerContent}
            </Heading>
            <Text fontSize="sm" color={timeColor}>
                {formattedTime}
            </Text>
        </Box>
    );
});

export const StakingActivity: FC<Props> = memo(
    ({ userAccount, poolAddress }) => {
        const [timestamp, setTimestamp] = useState<number | null>();
        const [list, updateList] = useState(null);
        const { activities, loading } = usePoolActivities({
            pool: poolAddress,
            user: userAccount,
            beforeInMillis: timestamp,
        });
        const oldestActivityTime =
            (list && last<ActivityType>(list)?.timestamp) || timestamp;

        const isAllActivitiesLoaded =
            timestamp === oldestActivityTime && !loading;
        const emptyIconBg = useColorModeValue(
            'dark.gray.senary',
            'dark.gray.primary'
        );
        const emptyIconColor = useColorModeValue(
            'dark.secondary',
            'dark.primary'
        );
        const checkIconColor = useColorModeValue(
            'dark.secondary',
            'dark.primary'
        );

        useEffect(() => {
            if (null !== activities) {
                updateList((list) =>
                    null !== list ? [...list, ...activities] : activities
                );
            }
        }, [activities]);

        return (
            <>
                <Heading as="h2" size="md" mb={10}>
                    My staking activities
                </Heading>
                <VStack spacing={8} alignItems="flex-start">
                    {!list && <Loader isLoading={loading} />}
                    {list?.length > 0 && (
                        <>
                            {list.map((activity, index) => (
                                <HStack
                                    key={index}
                                    justifyContent="flex-start"
                                    spacing={4}
                                    alignItems="center"
                                    minW={167}
                                >
                                    <CheckCircleIcon
                                        w={6}
                                        h={6}
                                        color={checkIconColor}
                                    />
                                    <Activity
                                        key={activity.id}
                                        amount={activity.amount}
                                        timestamp={activity.timestamp}
                                        type={activity.type}
                                    />
                                </HStack>
                            ))}
                            <HStack
                                justifyContent="flex-end"
                                alignItems="flex-end"
                                minW={167}
                            >
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
                                    <Text as="sub" color="gray.500">
                                        All activities loaded
                                    </Text>
                                )}
                            </HStack>
                        </>
                    )}
                    {!loading && list?.length === 0 && (
                        <VStack
                            alignItems="center"
                            spacing={4}
                            w="full"
                            textAlign="center"
                            fontSize="sm"
                        >
                            <Box
                                w={14}
                                h={14}
                                borderRadius="full"
                                display="grid"
                                placeContent="center"
                                flexShrink={0}
                                marginBottom={0}
                            >
                                <EmptyTransactionIcon
                                    fill={emptyIconBg}
                                    stroke={emptyIconColor}
                                    w={16}
                                    h={16}
                                />
                            </Box>

                            <Text>
                                You haven’t had any transaction yet. Start
                                delegation by depositing.
                            </Text>
                        </VStack>
                    )}
                </VStack>
            </>
        );
    }
);
