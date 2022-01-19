// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
    Box,
    Heading,
    HStack,
    Link,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import {
    AllowenceIcon,
    StakedBalanceIcon,
    WalletIcon,
} from '../../components/Icons';

export const StakingGuide: FC = () => {
    const steps = [
        {
            title: 'Connect Wallet',
            description:
                'Connect to your wallet, make sure there is enough CTSI & ETH for staking.',
            icon: <WalletIcon color="blue.500" w={6} h={6} />,
            bgColor: 'blue.100',
        },
        {
            title: 'Allowance / Deposit',
            description:
                'Allowance is the amount of CTSI or ETH you are allowed to stake. Deposit is the amount of CTSI ot ETH you owe.',
            icon: <AllowenceIcon color="yellow.500" w={6} h={6} />,
            bgColor: 'yellow.100',
        },
        {
            title: 'Stake',
            description: 'Stake is the amount of CTSI or ETH you are staking.',
            icon: <StakedBalanceIcon color="green.500" w={6} h={6} />,
            bgColor: 'green.100',
        },
    ];

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
                <Link href="#" isExternal fontSize="sm">
                    Learn from offical tutorial <ExternalLinkIcon />
                </Link>
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
                            bg={step.bgColor}
                            w={14}
                            h={14}
                            borderRadius="full"
                            display="grid"
                            placeContent="center"
                            flexShrink={0}
                        >
                            {step.icon}
                        </Box>

                        <VStack alignItems="flex-start">
                            <Heading as="h3" size="sm">
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
