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
    Text,
    Button,
    Flex,
    HStack,
    Stack,
    useColorModeValue,
    VStack,
    Heading,
} from '@chakra-ui/react';

import { BigNumber } from 'ethers';
import { FC } from 'react';
import { StakedBalanceIcon } from '../../Icons';
import CTSI from '../../pools/staking/CTSI';

export interface IStakedBalanceSection {
    stakedBalance: BigNumber;
    onUnstakeClick: () => void;
}

export const StakedBalanceSection: FC<IStakedBalanceSection> = ({
    stakedBalance,
    onUnstakeClick,
}) => {
    const bg = useColorModeValue('white', 'gray.800');

    return (
        <Box
            bg={bg}
            borderRadius="lg"
            shadow="sm"
            p={6}
            pl={{ base: 6, md: 8 }}
        >
            <Stack
                flexDirection={{ base: 'column', md: 'row' }}
                justifyContent="space-between"
            >
                <HStack spacing={4} alignItems="center">
                    <Box
                        bg={'green.100'}
                        w={14}
                        h={14}
                        borderRadius="full"
                        display="grid"
                        placeContent="center"
                    >
                        <StakedBalanceIcon color="green" w={6} h={6} />
                    </Box>
                    <Box>
                        <Text color="gray.400">Your staked balance</Text>
                        <Heading m={0} size="lg">
                            <Flex align="baseline">
                                <CTSI value={stakedBalance} />
                                <Text ml={1}>CTSI</Text>
                            </Flex>
                        </Heading>
                    </Box>
                </HStack>

                <VStack
                    spacing={4}
                    alignItems="stretch"
                    pt={{ base: 6, md: 0 }}
                >
                    <Box>
                        <Button
                            variant="outline"
                            w={{ base: '100%', md: 'auto' }}
                            minW="15rem"
                            onClick={onUnstakeClick}
                            colorScheme="darkGray"
                            disabled={stakedBalance.isZero()}
                        >
                            Unstake
                        </Button>
                    </Box>
                </VStack>
            </Stack>
        </Box>
    );
};
