// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { CheckCircleIcon } from '../../components/Icons';

export const StakingActivity: FC = () => {
    const activities = [
        {
            id: '0x0',
            type: 'Deposit',
            amount: '2000.00',
            currency: 'CTSI',
            createdAt: '2020-05-01T00:00:00.000Z',
        },
        {
            id: '0x1',
            type: 'Withdraw',
            amount: '10.00',
            currency: 'CTSI',
            createdAt: '2020-04-01T00:00:00.000Z',
        },
        {
            id: '0x2',
            type: 'Deposit',
            amount: '300.50',
            currency: 'CTSI',
            createdAt: '2020-03-01T00:00:00.000Z',
        },
    ];

    // const activities = [];

    return (
        <>
            <Heading as="h2" size="md" mb={10}>
                My staking activities
            </Heading>
            <VStack spacing={8} alignItems="flex-start">
                {activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <HStack
                            key={index}
                            justifyContent="flex-start"
                            spacing={4}
                            alignItems="flex-start"
                        >
                            <CheckCircleIcon w={6} h={6} color="green.500" />
                            <Box>
                                <Heading as="h4" size="sm">
                                    {activity.type} {activity.amount}{' '}
                                    {activity.currency}
                                </Heading>
                                <Text fontSize="sm" color="gray.400">
                                    {new Intl.DateTimeFormat('en-US', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short',
                                    }).format(new Date(activity.createdAt))}
                                </Text>
                            </Box>
                        </HStack>
                    ))
                ) : (
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
};
