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
    AspectRatio,
} from '@chakra-ui/react';

import { BigNumber } from 'ethers';
import { FC } from 'react';
import { TimeIcon } from '../Icons';
import CTSI from '../pools/staking/CTSI';

export interface INodeMaturingSection {
    maturingBalance: BigNumber;
}

export const NodeMaturingSection: FC<INodeMaturingSection> = ({
    maturingBalance,
}) => {
    const bg = useColorModeValue('white', 'gray.800');

    return (
        <Box
            bg={bg}
            borderTopRadius="lg"
            shadow="sm"
            p={6}
            pl={5}
            borderLeftWidth={14}
            borderLeftColor={maturingBalance.isZero() ? 'gray.200' : 'blue.200'}
        >
            <Stack
                flexDirection={{ base: 'column', md: 'row' }}
                justifyContent="space-between"
            >
                <HStack spacing={4} alignItems="center">
                    <Box
                        w={14}
                        h={14}
                        minW={14}
                        borderRadius="full"
                        display="grid"
                        placeContent="center"
                    >
                        <TimeIcon
                            color={
                                maturingBalance.isZero()
                                    ? 'gray.200'
                                    : 'blue.200'
                            }
                            w={9}
                            h={9}
                        />
                    </Box>

                    <Box>
                        <Text pb={1} color="gray.400">
                            Maturing
                        </Text>
                        <Text pb={1} fontSize={'sm'} color="gray.400">
                            The staking will take 6 hours to be ready. Each new
                            stake will restart the waiting time.
                        </Text>
                        <Heading m={0} size="lg">
                            <Flex align="baseline">
                                <CTSI value={maturingBalance} />
                                <Text ml={1}>CTSI</Text>
                            </Flex>
                        </Heading>
                    </Box>
                </HStack>
            </Stack>
        </Box>
    );
};
