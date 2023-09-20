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
    Stack,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { AllowanceIcon, StakedBalanceIcon, WalletIcon } from '@explorer/ui';

export const steps = [
    {
        title: 'Connect Wallet',
        description:
            'Connect to your wallet and make sure you have enough CTSI to stake as well as ETH for the accruing gas fee (transaction fee).',
        icon: (color = 'orange.500') => (
            <WalletIcon color={color} w={6} h={6} />
        ),
    },
    {
        title: 'Allowance / Deposit',
        description:
            'Set up the maximum amount of tokens for the pool to transfer out of your wallet and deposit.',
        icon: (color = 'orange.500') => (
            <AllowanceIcon color={color} w={6} h={6} />
        ),
    },
    {
        title: 'Stake',
        description:
            'After staking, your deposit will starts contributing to the staking power of the pool.',
        icon: (color = 'orange.500') => (
            <StakedBalanceIcon color={color} w={6} h={6} />
        ),
    },
];

export const StakingGuide: FC = () => {
    const iconColor = useColorModeValue('dark.secondary', 'dark.primary');
    const iconBg = useColorModeValue('dark.gray.senary', 'dark.gray.primary');

    return (
        <>
            <Stack
                spacing={4}
                mb={10}
                direction={{ base: 'column', md: 'row' }}
                alignItems="center"
            >
                <Heading as="h2" size="lg">
                    Staking in a few steps
                </Heading>
            </Stack>
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                spacing={12}
                justifyContent="space-between"
            >
                {steps.map((step, index) => (
                    <HStack
                        key={index}
                        alignItems="flex-start"
                        spacing={4}
                        flexBasis={{ base: '100%', lg: '33.33%' }}
                    >
                        <Box
                            bg={iconBg}
                            w={14}
                            h={14}
                            borderRadius="full"
                            display="grid"
                            placeContent="center"
                            flexShrink={0}
                        >
                            {step.icon(iconColor)}
                        </Box>

                        <VStack alignItems="flex-start">
                            <Heading as="h3" size="sm" fontWeight="bold">
                                {index + 1}. {step.title}
                            </Heading>
                            <Text>{step.description}</Text>
                        </VStack>
                    </HStack>
                ))}
            </Stack>
        </>
    );
};
