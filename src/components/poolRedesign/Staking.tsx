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
import { TransactionInfoBanner } from './TransactionInfoBanner';
import { formatUnits } from 'ethers/lib/utils';
import CTSI from '../pools/staking/CTSI';

export interface StakingProps extends StackProps {
    userWalletBalance: BigNumber; // wallet balance
    allowance: BigNumber; // ERC20 allowance
    userPoolBalance: BigNumber; // user pool balance
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
    userWalletBalance,
    userPoolBalance,
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

    const toCTSI = (value: BigNumber) => {
        // formatter for CTSI values
        const numberFormat = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });

        return numberFormat.format(parseFloat(formatUnits(value, 18)));
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
                            disabled={
                                allowance.isZero() ||
                                userWalletBalance.isZero() ||
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
                        title={`${toCTSI(
                            userPoolBalance
                        )} CTSI will be ready for staking soon`}
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
                                        <CTSI value={userPoolBalance} />
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
                                    disabled={
                                        !!unlock || userPoolBalance.isZero()
                                    }
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
                                    disabled={userPoolBalance.isZero()}
                                >
                                    Withdraw
                                </Button>
                            </Box>
                        </VStack>
                    </Stack>
                </Box>
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
                                    disabled={
                                        staked.isZero() ||
                                        userPoolBalance.isZero()
                                    }
                                >
                                    Unstake
                                </Button>
                            </Box>
                        </VStack>
                    </Stack>
                </Box>
            </VStack>

            <StakingDepositModal
                isOpen={depositDisclosure.isOpen}
                onClose={depositDisclosure.onClose}
                allowance={allowance}
                balance={userWalletBalance}
                disclosure={depositDisclosure}
                onSave={(amount) => {
                    console.log('deposit transaction', toCTSI(amount));
                    setCurrentTransaction('deposit');
                    setTransactionBanners({
                        ...transactionBanners,
                        deposit: true,
                    });
                    onDeposit(amount);
                }}
            />

            <StakingStakeModal
                isOpen={stakeDisclosure.isOpen}
                onClose={stakeDisclosure.onClose}
                balance={userWalletBalance}
                userBalance={userPoolBalance}
                disclosure={stakeDisclosure}
                onSave={(amount) => {
                    console.log('stake transaction', toCTSI(amount));
                    setCurrentTransaction('stake');
                    setTransactionBanners({
                        ...transactionBanners,
                        stake: true,
                    });
                    onStake(amount);
                }}
            />

            <StakingWithdrawModal
                isOpen={withdrawDisclosure.isOpen}
                onClose={withdrawDisclosure.onClose}
                userBalance={userPoolBalance}
                disclosure={withdrawDisclosure}
                onSave={(amount) => {
                    console.log('withdraw transaction', toCTSI(amount));
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
                userBalance={userPoolBalance}
                disclosure={unstakeDisclosure}
                onSave={(amount) => {
                    console.log('unstake transaction', toCTSI(amount));
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
