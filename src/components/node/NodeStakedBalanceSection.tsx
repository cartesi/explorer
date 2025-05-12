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
    Flex,
    HStack,
    Heading,
    Stack,
    Text,
    Icon,
} from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';

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
    const bg = useColorModeValue('white', 'dark.gray.tertiary');
    const borderColor = useColorModeValue(
        'dark.border.tertiary',
        'dark.gray.quaternary'
    );
    const iconColor = useColorModeValue('dark.secondary', 'dark.primary');
    const iconBg = useColorModeValue('dark.gray.senary', 'dark.gray.secondary');

    return (
        <Box
            borderRadius="1rem"
            borderWidth="1px"
            borderColor={borderColor}
            bg={bg}
            p={6}
            mt={5}
            minHeight="7.125rem"
        >
            <Stack
                flexDirection={{ base: 'column', md: 'row' }}
                justifyContent="space-between"
            >
                <HStack alignItems="center">
                    <Box
                        bg={iconBg}
                        w="4.125rem"
                        h="4.125rem"
                        borderRadius="full"
                        display="grid"
                        placeContent="center"
                        mr={5}
                    >
                        <Icon
                            as={StakedBalanceIcon}
                            w={8}
                            h={8}
                            ml={1}
                            color={iconColor}
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
