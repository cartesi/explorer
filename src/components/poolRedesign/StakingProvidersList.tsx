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
    Button,
    Heading,
    HStack,
    Image,
    Link,
    Stack,
    StackDivider,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';

interface StakingTabNavigationProps {
    onConnect: (value: string) => void;
}

export const StakingProvidersList: FC<StakingTabNavigationProps> = ({
    onConnect,
}) => {
    const bg = useColorModeValue('white', 'gray.800');

    const providers = [
        {
            name: 'Metamask wallet',
            icon: '/images/metamask-fox.svg',
            link: '#',
            linkLabel: 'Learn from Metamask',
            btnLabel: 'Connect',
            onClick: () => {
                onConnect('metamask');
            },
        },
        {
            name: 'Coinbase wallet',
            icon: '/images/coinbase.svg',
            link: '#',
            linkLabel: 'Learn from Coinbase',
            btnLabel: 'Connect',
            onClick: () => {
                onConnect('coinbase');
            },
        },
    ];

    return (
        <>
            <Text mb={5}>
                You will be leaded to the connecting process of selected wallet.
            </Text>
            <VStack
                divider={<StackDivider />}
                bg={bg}
                borderRadius="lg"
                shadow="sm"
            >
                {providers.map((provider) => (
                    <Stack
                        direction={{ base: 'column', md: 'row' }}
                        w="full"
                        alignItems="center"
                        spacing={6}
                        key={provider.name}
                        p={5}
                    >
                        <HStack
                            flexGrow={1}
                            spacing="1rem"
                            w={{ base: '100%', md: 'auto' }}
                        >
                            <Image src={provider.icon} boxSize="3.5rem" />
                            <Box>
                                <Heading as="h4" size="md">
                                    {provider.name}
                                </Heading>
                                <Link
                                    href={provider.link}
                                    fontSize="xs"
                                    isExternal
                                >
                                    {provider.linkLabel}
                                    <ExternalLinkIcon mx="2px" />
                                </Link>
                            </Box>
                        </HStack>
                        <Button
                            w={{ base: '100%', md: 'auto' }}
                            onClick={provider.onClick}
                            borderRadius="full"
                            colorScheme="darkGray"
                        >
                            Connect
                        </Button>
                    </Stack>
                ))}
            </VStack>
        </>
    );
};
