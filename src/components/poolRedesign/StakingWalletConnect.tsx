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
    HStack,
    Stack,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';

interface StakingTabNavigationProps {
    onConnect: (value: string) => void;
}

export const StakingWalletConnect: FC<StakingTabNavigationProps> = ({
    onConnect,
}) => {
    const bg = useColorModeValue('white', 'gray.800');

    return (
        <>
            <VStack bg={bg} borderRadius="lg" shadow="sm">
                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    w="full"
                    alignItems="center"
                    spacing={6}
                    p={5}
                >
                    <HStack
                        flexGrow={1}
                        spacing="1rem"
                        w={{ base: '100%', md: 'auto' }}
                    >
                        <Box>
                            <Text>
                                You will be leaded to the connecting process of
                                selected wallet.
                            </Text>
                        </Box>
                    </HStack>
                    <Button
                        w={{ base: '100%', md: 'auto' }}
                        onClick={() => {
                            onConnect('metamask');
                        }}
                        colorScheme="darkGray"
                    >
                        Connect Your Wallet
                    </Button>
                </Stack>
            </VStack>
        </>
    );
};
