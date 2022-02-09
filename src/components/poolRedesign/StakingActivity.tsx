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
    Image,
    Text,
    VStack,
    Spinner,
} from '@chakra-ui/react';
import React, { FC, memo } from 'react';
import { CheckCircleIcon } from '../../components/Icons';
import usePoolUserActivity from '../../graphql/hooks/usePoolUserActivity';
import { formatValue } from '../../utils/numberFormatter';

interface Props {
    userAccount: string;
    poolAddress: string;
}

const ctsiFormatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
};

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
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

    return (
        <Box>
            <Heading as="h4" size="sm">
                {headerContent}
            </Heading>
            <Text fontSize="sm" color="gray.400">
                {formattedTime}
            </Text>
        </Box>
    );
});

export const StakingActivity: FC<Props> = memo(
    ({ userAccount, poolAddress }) => {
        const { activities, loading } = usePoolUserActivity({
            pool: poolAddress,
            user: userAccount,
        });

        return (
            <>
                <Heading as="h2" size="md" mb={10}>
                    My staking activities
                </Heading>
                <VStack spacing={8} alignItems="flex-start">
                    <Loader isLoading={loading} />
                    {activities?.length > 0 &&
                        activities.map((activity, index) => (
                            <HStack
                                key={index}
                                justifyContent="flex-start"
                                spacing={4}
                                alignItems="flex-start"
                            >
                                <CheckCircleIcon
                                    w={6}
                                    h={6}
                                    color="green.500"
                                />
                                <Activity
                                    key={activity.id}
                                    amount={activity.amount}
                                    timestamp={activity.timestamp}
                                    type={activity.type}
                                />
                            </HStack>
                        ))}
                    {activities?.length === 0 && (
                        <VStack
                            alignItems="center"
                            spacing={4}
                            w="full"
                            textAlign="center"
                            fontSize="sm"
                        >
                            <Image src="/images/empty-activity.svg" />
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
