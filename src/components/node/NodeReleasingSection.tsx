// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Text,
    Flex,
    HStack,
    Stack,
    useColorModeValue,
    Heading,
} from '@chakra-ui/react';

import { BigNumber } from 'ethers';
import { FC } from 'react';
import { WalletIcon } from '../Icons';
import CTSI from '../pools/staking/CTSI';

export interface INodeReleasingSection {
    releasingBalance: BigNumber;
}

export const NodeReleasingSection: FC<INodeReleasingSection> = ({
    releasingBalance,
}) => {
    const bg = useColorModeValue('white', 'gray.800');

    return (
        <Box
            bg={bg}
            borderRadius="lg"
            shadow="sm"
            p={6}
            mt={6}
            pl={{ base: 6, md: 8 }}
        >
            <Stack
                flexDirection={{ base: 'column', md: 'row' }}
                justifyContent="space-between"
            >
                <HStack spacing={4} alignItems="center">
                    <Box
                        bg={'yellow.100'}
                        w={14}
                        h={14}
                        borderRadius="full"
                        display="grid"
                        placeContent="center"
                    >
                        <WalletIcon color="yellow.500" w={6} h={6} />
                    </Box>
                    <Box>
                        <Text pb={1} color="gray.400">
                            Releasing
                        </Text>
                        <Text pb={1} fontSize={'sm'} color="gray.400">
                            Your funds take 48 hours to become unblocked.
                        </Text>
                        <Heading m={0} size="lg">
                            <Flex align="baseline">
                                <CTSI value={releasingBalance} />
                                <Text ml={1}>CTSI</Text>
                            </Flex>
                        </Heading>
                    </Box>
                </HStack>
            </Stack>
        </Box>
    );
};
