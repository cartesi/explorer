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
    useColorModeValue,
} from '@chakra-ui/react';

import { StakedBalanceIcon } from '@explorer/ui';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import CTSI from '../pools/staking/CTSI';

export interface INodeStakedBalanceSection {
    stakedBalance: BigNumber;
}

export const NodeStakedBalanceSection: FC<INodeStakedBalanceSection> = ({
    stakedBalance,
}) => {
    const bg = useColorModeValue('white', 'dark.background.secondary');
    const bgIcon = useColorModeValue('teal.light', 'black');
    const iconColor = useColorModeValue('light.primary', 'cyan');
    return (
        <Box
            bg={bg}
            shadow="md"
            p={6}
            mt={5}
            minHeight="7.125rem"
            borderRadius={'2xl'}
            border="1px solid"
            borderColor={'dark.border.quaternary'}
        >
            <Stack
                flexDirection={{ base: 'column', md: 'row' }}
                justifyContent="space-between"
            >
                <HStack ml={3} alignItems="center">
                    <Box
                        bg={bgIcon}
                        w="4.125rem"
                        h="4.125rem"
                        borderRadius="full"
                        display="grid"
                        placeContent="center"
                        mr={5}
                    >
                        <StakedBalanceIcon
                            color={iconColor}
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
