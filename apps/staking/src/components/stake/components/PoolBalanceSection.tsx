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
import { PoolBalanceIcon } from '@explorer/ui';
import CTSI from '../../pools/staking/CTSI';

export interface IPoolBalanceSectionProps {
    userPoolBalance: BigNumber;
    isPoolBalanceLocked: boolean;
    onStakeClick: () => void;
    onWithdrawClick: () => void;
}

export const PoolBalanceSection: FC<IPoolBalanceSectionProps> = ({
    userPoolBalance,
    isPoolBalanceLocked,
    onStakeClick,
    onWithdrawClick,
}) => {
    const balanceColor = useColorModeValue('gray.400', 'white');
    const bg = useColorModeValue('white', 'dark.gray.tertiary');
    const boxShadow = useColorModeValue('sm', 'none');
    const borderColor = useColorModeValue('gray.100', 'dark.border.quaternary');
    const iconColor = useColorModeValue('dark.secondary', 'dark.primary');
    const iconBg = useColorModeValue('dark.gray.senary', 'dark.gray.primary');
    const colorScheme = useColorModeValue('teal', 'blue');

    return (
        <Box
            bg={bg}
            shadow={boxShadow}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="1rem"
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
                        <PoolBalanceIcon color={iconColor} w={6} h={6} />
                    </Box>
                    <Box>
                        {isPoolBalanceLocked ? (
                            <Text color={balanceColor}>
                                Your pool balance (currently locked)
                            </Text>
                        ) : (
                            <Text color={balanceColor}>Your pool balance</Text>
                        )}
                        <Heading m={0} size="sm">
                            <Flex align="baseline">
                                <CTSI value={userPoolBalance} />
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
                        width="173px"
                        ml="auto"
                        onClick={onStakeClick}
                        colorScheme={colorScheme}
                        disabled={
                            isPoolBalanceLocked || userPoolBalance.isZero()
                        }
                    >
                        Stake
                    </Button>
                    <Button
                        variant="ghost"
                        colorScheme="darkGray"
                        width="173px"
                        ml="auto"
                        onClick={onWithdrawClick}
                        disabled={userPoolBalance.isZero()}
                    >
                        Withdraw
                    </Button>
                </VStack>
            </Stack>
        </Box>
    );
};
