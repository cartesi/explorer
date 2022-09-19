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
import { StakedBalanceIcon } from '../Icons';
import CTSI from '../pools/staking/CTSI';

export interface INodeStakedBalanceSection {
    stakedBalance: BigNumber;
}

export const NodeStakedBalanceSection: FC<INodeStakedBalanceSection> = ({
    stakedBalance,
}) => {
    const bg = useColorModeValue('white', 'gray.800');

    return (
        <Box bg={bg} shadow="md" p={6} mt={5} minHeight="7.125rem">
            <Stack
                flexDirection={{ base: 'column', md: 'row' }}
                justifyContent="space-between"
            >
                <HStack spacing={5} alignItems="center">
                    <Box
                        bg="blue.50"
                        w="4.125rem"
                        h="4.125rem"
                        borderRadius="full"
                        display="grid"
                        placeContent="center"
                    >
                        <StakedBalanceIcon
                            color="blue.400"
                            w={8}
                            h={8}
                            ml={0.5}
                        />
                    </Box>
                    <Box>
                        <Text fontSize="md" mb={2}>
                            Your staked balance
                        </Text>
                        <Heading m={0} size="sm">
                            <Flex align="baseline">
                                <CTSI value={stakedBalance} />
                                <Text ml={1}>CTSI</Text>
                            </Flex>
                        </Heading>
                    </Box>
                </HStack>
            </Stack>
        </Box>
    );
};
