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
    Flex,
    Heading,
    HStack,
    Link,
    Stack,
    StackProps,
    Text,
    useColorModeValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import {
    PoolBalanceIcon,
    StakedBalanceIcon,
    TimeIcon,
    TimerIcon,
} from '../../components/Icons';
import { InfoBanner } from './InfoBanner';
import { StakingDepositModal } from './modals/StakingDepositModal';
import { StakingStakeModal } from './modals/StakingStakeModal';
import { StakingUnstakeModal } from './modals/StakingUnstakeModal';
import { StakingWithdrawModal } from './modals/StakingWithdrawModal';
import { BigNumber, BigNumberish } from 'ethers';
import { Transaction } from '../../services/transaction';

import { useTimeLeft } from '../../utils/react';
import CTSI from '../pools/staking/CTSI';
import { TransactionInfoBanner } from './TransactionInfoBanner';
import { formatUnits } from 'ethers/lib/utils';

export interface StakingProps extends StackProps {
    balance: BigNumber; // wallet balance
    allowance: BigNumber; // ERC20 allowance
    userBalance: BigNumber; // user pool balance
    userETHBalance: BigNumber; // user ETH balance
    // shares: BigNumber; // user shares
    staked: BigNumber; // user stake
    // withdrawBalance: BigNumber; // amount of token user can actually withdraw
    // paused: boolean;
    depositTimestamp: Date;
    lockTime: number;
    // onApprove: (amount: BigNumberish) => void;
    onDeposit: (amount: BigNumberish) => void;
    onWithdraw: (amount: BigNumberish) => void;
    onStake: (amount: BigNumberish) => void;
    onUnstake: (amount?: BigNumberish) => void;
    poolTransaction: Transaction<void>;
    tokenTransaction: Transaction<any>;
}

export const Staking: FC<StakingProps> = ({
    balance,
    userBalance,
    userETHBalance,
    staked,
    allowance,
    depositTimestamp,
    lockTime,
    onWithdraw,
    onDeposit,
    onStake,
    onUnstake,
    poolTransaction,
    tokenTransaction,
}) => {
    const stakeUnlock = depositTimestamp
        ? depositTimestamp.getTime() + lockTime * 1000
        : 0;
    const unlock = useTimeLeft(stakeUnlock, 2, false);
    const unlockHumanized = useTimeLeft(stakeUnlock, 2, true);

    const bg = useColorModeValue('white', 'gray.800');
    const infoColor = useColorModeValue('blue.500', 'blue.200');

    const depositDisclosure = useDisclosure();
    const withdrawDisclosure = useDisclosure();
    const stakeDisclosure = useDisclosure();
    const unstakeDisclosure = useDisclosure();

    const [currentTransaction, setCurrentTransaction] = useState<any>(null);
    const [transactionBanners, setTransactionBanners] = useState<any>({});

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
                            disabled={
                                allowance.isZero() ||
                                balance.isZero() ||
                                userETHBalance.isZero()
                            }
                        >
                            Deposit
                        </Button>
                    </Box>
                </Stack>

                <TransactionInfoBanner
                    title="Setting allowance..."
                    failTitle="Error setting allowance"
                    successDescription="New allowance set sucessfully."
                    transaction={tokenTransaction}
                />

                {transactionBanners?.deposit && (
                    <TransactionInfoBanner
                        title="Setting deposit..."
                        failTitle="Error setting deposit"
                        successDescription="New deposit set sucessfully."
                        transaction={
                            currentTransaction === 'deposit'
                                ? poolTransaction
                                : null
                        }
                    />
                )}
                {unlock && (
                    <InfoBanner
                        title={`${userBalance} CTSI will be ready for staking soon`}
                        content={`It will take ${
                            unlockHumanized || 'unknown'
                        } to unlock your deposited tokens before staking them.`}
                        isOpen
                        status="info"
                        icon={
                            <VStack mr={4} spacing={1} color={infoColor}>
                                <TimerIcon boxSize="6" />
                                <Box fontSize="xs" fontWeight="bold">
                                    {unlock}
                                </Box>
                            </VStack>
                        }
                    />
                )}

                {/* <TransactionInfoBanner
                    title="Sending transaction... (pool)..."
                    transaction={poolTransaction}
                /> */}

                {/* <InfoBanner
                    title="Withdrawing 15000 CTSI in pool..."
                    content="Staking is the process of locking your CTSI tokens to the network. This allows you to earn rewards for staking."
                    isOpen
                    isClosable
                    status="success"
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
                /> */}

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
                                {unlock ? (
                                    <Text color="gray.400">
                                        Your pool balance (currently locked)
                                    </Text>
                                ) : (
                                    <Text color="gray.400">
                                        Your pool balance
                                    </Text>
                                )}
                                <Heading m={0} size="lg">
                                    <Flex align="baseline">
                                        <CTSI value={userBalance} />
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
                                    w={{ base: '100%', md: 'auto' }}
                                    minW="15rem"
                                    onClick={stakeDisclosure.onOpen}
                                    colorScheme="darkGray"
                                    disabled={userBalance.isZero()}
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
                                    disabled={userBalance.isZero()}
                                >
                                    Withdraw
                                </Button>
                            </Box>
                        </VStack>
                    </Stack>
                </Box>
                {/* <InfoBanner
                    title="Unstaking 200 CTSI to the pool balance..."
                    content="Please, wait for your 200 CTSI unstaked funds to be released in the pool balance. According to the system history, it usually takes 3 hours to arrive."
                    icon={<TimeIcon boxSize="6" color={infoColor} mr={3} />}
                    isOpen
                    isExpandable
                    status="info"
                /> */}
                {transactionBanners?.stake && (
                    <TransactionInfoBanner
                        title="Staking..."
                        failTitle="Error staking"
                        successDescription="Stake set sucessfully."
                        transaction={
                            currentTransaction === 'stake'
                                ? poolTransaction
                                : null
                        }
                    />
                )}

                {transactionBanners?.withdraw && (
                    <TransactionInfoBanner
                        title="Withdrawing..."
                        failTitle="Error withdrawing"
                        successDescription="Withdrawed sucessfully."
                        transaction={
                            currentTransaction === 'withdraw'
                                ? poolTransaction
                                : null
                        }
                    />
                )}
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
                                    <Flex align="baseline">
                                        <CTSI value={staked} />
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
                                    onClick={unstakeDisclosure.onOpen}
                                    colorScheme="darkGray"
                                    disabled={userBalance.isZero()}
                                >
                                    Unstake
                                </Button>
                            </Box>
                        </VStack>
                    </Stack>
                </Box>
            </VStack>
            {transactionBanners?.unstake && (
                <TransactionInfoBanner
                    title="Unstaking..."
                    failTitle="Error unstaking"
                    successDescription="Unstaked sucessfully."
                    transaction={
                        currentTransaction === 'unstake'
                            ? poolTransaction
                            : null
                    }
                />
            )}
            <StakingDepositModal
                isOpen={depositDisclosure.isOpen}
                onClose={depositDisclosure.onClose}
                allowance={allowance}
                balance={balance}
                onSave={(amount) => {
                    console.log('deposit transaction', poolTransaction);
                    setCurrentTransaction('deposit');
                    setTransactionBanners({
                        ...transactionBanners,
                        deposit: true,
                    });
                    onDeposit(amount);
                }}
                disclosure={depositDisclosure}
            />

            <StakingStakeModal
                isOpen={stakeDisclosure.isOpen}
                onClose={stakeDisclosure.onClose}
                balance={balance}
                userBalance={userBalance}
                onSave={(amount) => {
                    console.log('stake transaction', amount, poolTransaction);
                    setCurrentTransaction('stake');
                    setTransactionBanners({
                        ...transactionBanners,
                        stake: true,
                    });
                    onStake(amount);
                }}
                disclosure={stakeDisclosure}
            />

            <StakingWithdrawModal
                isOpen={withdrawDisclosure.isOpen}
                onClose={withdrawDisclosure.onClose}
                userBalance={userBalance}
                onSave={(amount) => {
                    console.log('withdraw transaction', amount);
                    setCurrentTransaction('withdraw');
                    setTransactionBanners({
                        ...transactionBanners,
                        withdraw: true,
                    });
                    onWithdraw(amount);
                }}
            />

            <StakingUnstakeModal
                isOpen={unstakeDisclosure.isOpen}
                onClose={unstakeDisclosure.onClose}
                userBalance={userBalance}
                onSave={(amount) => {
                    console.log('unstake transaction', amount);
                    setCurrentTransaction('unstake');
                    setTransactionBanners({
                        ...transactionBanners,
                        unstake: true,
                    });
                    onUnstake(amount);
                }}
            />
        </>
    );
};
