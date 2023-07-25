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
    Button,
    Flex,
    HStack,
    Heading,
    Stack,
    Text,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';

import { StakedBalanceIcon } from '@explorer/ui';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import CTSI from '../../pools/staking/CTSI';

export interface IStakedBalanceSection {
    stakedBalance: BigNumber;
    onUnstakeClick: () => void;
}

export const StakedBalanceSection: FC<IStakedBalanceSection> = ({
    stakedBalance,
    onUnstakeClick,
}) => {
    const stakedBalanceColor = useColorModeValue('gray.400', 'white');
    const bg = useColorModeValue('white', 'dark.gray.tertiary');
    const boxShadow = useColorModeValue('sm', 'none');
    const borderColor = useColorModeValue('gray.100', 'dark.border.quaternary');
    const iconColor = useColorModeValue('dark.secondary', 'dark.primary');
    const iconBg = useColorModeValue('dark.gray.senary', 'dark.gray.primary');

    return (
        <Box
            bg={bg}
            shadow={boxShadow}
            borderWidth="1px"
            borderRadius={'2xl'}
            border="1px solid"
            borderColor={'dark.border.quaternary'}
            p={6}
            pl={{ base: 6, md: 8 }}
        >
            <Stack
                flexDirection={{ base: 'column', md: 'row' }}
                justifyContent="space-between"
            >
                <HStack spacing={4} alignItems="center">
                    <Box
                        bg={iconBg}
                        w={14}
                        h={14}
                        borderRadius="full"
                        display="grid"
                        placeContent="center"
                    >
                        <StakedBalanceIcon color={iconColor} w={7} h={7} />
                    </Box>
                    <Box>
                        <Text color={stakedBalanceColor}>
                            Your staked balance
                        </Text>
                        <Heading m={0} size="sm">
                            <Flex align="baseline">
                                <CTSI value={stakedBalance} />
                                <Text ml={1} fontSize="sm">
                                    CTSI
                                </Text>
                            </Flex>
                        </Heading>
                    </Box>
                </HStack>

                <VStack
                    spacing={4}
                    alignItems="stretch"
                    pt={{ base: 6, md: 0 }}
                >
                    <Button
                        variant="ghost"
                        width="173px"
                        ml="auto"
                        onClick={onUnstakeClick}
                        colorScheme="darkGray"
                        disabled={stakedBalance.isZero()}
                    >
                        Unstake
                    </Button>
                </VStack>
            </Stack>
        </Box>
    );
};
