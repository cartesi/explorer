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
    Link,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import {
    PoolBalanceIcon,
    StakedBalanceIcon,
    TimeIcon,
    TimerIcon,
} from '../../components/Icons';
import { InfoBanner } from './InfoBanner';
import { StakingDeposit } from './StakingDeposit';
import { StakingStake } from './StakingStake';
import { StakingUnstake } from './StakingUnstake';
import { StakingWithdraw } from './StakingWithdraw';

export const Staking: FC = () => {
    const bg = useColorModeValue('white', 'gray.800');
    const infoColor = useColorModeValue('blue.500', 'blue.200');
    const depositDisclosure = useDisclosure();
    const withdrawDisclosure = useDisclosure();
    const stakeDisclosure = useDisclosure();
    const unstakeDisclosure = useDisclosure();

    const onWithdraw = (amount: string) => {
        console.log('onWithdraw', amount);
    };

    const onUnstake = (amount: string) => {
        console.log('onUnstake', amount);
    };

    const onStake = (amount: string) => {
        console.log('onStake', amount);
    };

    const onDeposit = (amount: string) => {
        console.log('onDeposit', amount);
    };

    return (
        <>
            <VStack spacing={6} alignItems="stretch">
                <Stack
                    spacing={4}
                    justifyContent="space-between"
                    alignContent="flex-start"
                    direction={{ base: 'column', md: 'row' }}
                >
                    <Box>
                        <Heading as="h2" size="lg" mb={0}>
                            Staking
                        </Heading>
                        <Link href="#" isExternal fontSize="xs">
                            Learn more <ExternalLinkIcon />
                        </Link>
                    </Box>
                    <Box px={6}>
                        <Button
                            colorScheme="blue"
                            onClick={depositDisclosure.onOpen}
                            w={{ base: '100%', md: 'auto' }}
                            minW="15rem"
                        >
                            Deposit
                        </Button>
                    </Box>
                </Stack>

                <InfoBanner
                    title="Withdrawing 15000 CTSI in pool..."
                    content="Staking is the process of locking your CTSI tokens to the network. This allows you to earn rewards for staking."
                    isOpen
                    isClosable
                    status="success"
                />

                <InfoBanner
                    title="500 CTSI will be ready in pool balance for staking soon."
                    content="500 CTSI are now on the way to the pool balance. It will take 6 minutes to settle your deposited tokens before staking it. "
                    isOpen
                    isExpandable
                    isExpanded
                    status="info"
                    icon={
                        <VStack mr={4} spacing={1} color={infoColor}>
                            <TimerIcon boxSize="6" />
                            <Box fontSize="xs" fontWeight="bold">
                                04:32
                            </Box>
                        </VStack>
                    }
                />

                <InfoBanner
                    title="Depositing 15000 CTSI in pool..."
                    content="Staking is the process of locking your CTSI tokens to the network. This allows you to earn rewards for staking."
                    isOpen
                    isExpandable
                    status="error"
                />

                <InfoBanner
                    title="Staking"
                    content="Staking is the process of locking your CTSI tokens to the network. This allows you to earn rewards for staking."
                    icon={<TimeIcon boxSize="6" color={infoColor} mr={3} />}
                    isOpen
                    isExpandable
                    status="info"
                />

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
                                bg="purple.100"
                                w={14}
                                h={14}
                                borderRadius="full"
                                display="grid"
                                placeContent="center"
                            >
                                <PoolBalanceIcon color="purple" w={6} h={6} />
                            </Box>
                            <Box>
                                <Text color="gray.400">Your pool balance</Text>
                                <Heading m={0} size="lg">
                                    500 CTSI
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
                                    w={{ base: '100%', md: 'auto' }}
                                    minW="15rem"
                                    onClick={stakeDisclosure.onOpen}
                                    colorScheme="darkGray"
                                >
                                    Stake
                                </Button>
                            </Box>
                            <Box>
                                <Button
                                    variant="outline"
                                    w={{ base: '100%', md: 'auto' }}
                                    minW="15rem"
                                    onClick={withdrawDisclosure.onOpen}
                                    colorScheme="darkGray"
                                >
                                    Withdraw
                                </Button>
                            </Box>
                        </VStack>
                    </Stack>
                </Box>

                <InfoBanner
                    title="Unstaking 200 CTSI to the pool balance..."
                    content="Please, wait for your 200 CTSI unstaked funds to be released in the pool balance. According to the system history, it usually takes 3 hours to arrive."
                    icon={<TimeIcon boxSize="6" color={infoColor} mr={3} />}
                    isOpen
                    isExpandable
                    status="info"
                />

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
                                <Text color="gray.400">
                                    Your staked balance
                                </Text>
                                <Heading m={0} size="lg">
                                    0 CTSI
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
                                    onClick={unstakeDisclosure.onOpen}
                                    colorScheme="darkGray"
                                >
                                    Unstake
                                </Button>
                            </Box>
                        </VStack>
                    </Stack>
                </Box>
            </VStack>

            <StakingDeposit
                isOpen={depositDisclosure.isOpen}
                onClose={depositDisclosure.onClose}
                onDeposit={onDeposit}
            />

            <StakingStake
                isOpen={stakeDisclosure.isOpen}
                onClose={stakeDisclosure.onClose}
                onStake={onStake}
            />

            <StakingUnstake
                isOpen={unstakeDisclosure.isOpen}
                onClose={unstakeDisclosure.onClose}
                onUnstake={onUnstake}
            />

            <StakingWithdraw
                isOpen={withdrawDisclosure.isOpen}
                onClose={withdrawDisclosure.onClose}
                onWithdraw={onWithdraw}
            />
        </>
    );
};
