// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useState } from 'react';
import Head from 'next/head';
import {
    Box,
    Button,
    Flex,
    Heading,
    Link,
    Spacer,
    Stack,
    useBreakpointValue,
    useColorModeValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';

import { useBalance, useBlockNumber } from '../../../services/eth';
import { useStaking } from '../../../services/staking';
import { useCartesiToken } from '../../../services/token';
import useUser from '../../../graphql/hooks/useUser';
import Layout from '../../../components/Layout';
import useSummary from '../../../graphql/hooks/useSummary';
import TransactionFeedback from '../../../components/TransactionFeedback';
import { useTimeLeft } from '../../../utils/react';
import { useUserNode } from '../../../graphql/hooks/useNodes';
import { useNode } from '../../../services/node';
import { useWallet } from '../../../contexts/wallet';
import {
    ArrowBackIcon,
    CheckCircleIcon,
    EditIcon,
    ExternalLinkIcon,
    WarningIcon,
} from '@chakra-ui/icons';
import { NodeStakingDashboard } from '../../../components/node/NodeStakingDashboard';
import { NodeMaturingSection } from '../../../components/node/NodeMaturingSection';
import { NodeReleasingSection } from '../../../components/node/NodeReleasingSection';
import { NodeInfoSection } from '../../../components/node/NodeInfoSection';

import { useRouter } from 'next/router';
import { NodeStakedBalanceSection } from '../../../components/node/NodeStakedBalanceSection';
import { NodeUnstakeModal } from '../../../components/node/modals/NodeUnstakeModal';
import { NodeStakeModal } from '../../../components/node/modals/NodeStakeModal';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { TransactionInfoBanner } from '../../../components/stake/TransactionInfoBanner';
import { NodeHiredBanner } from '../../../components/node/NodeHiredBanner';
import { NodeRetiredBanner } from '../../../components/node/NodeRetiredBanner';
import { NodeHireNodeSection } from '../../../components/node/NodeHireNodeSection';
import theme from '../../../styles/theme';

const ManageNode: FC = () => {
    const { account, chainId, active: isConnected } = useWallet();
    const blockNumber = useBlockNumber();
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const stepBoxBg = useColorModeValue('white', 'gray.700');

    const router = useRouter();
    const address = router.query.node as string;

    // user ETH balance
    const userBalance = useBalance(account);
    const userETHBalance = useBalance(account);

    const {
        staking,
        stakedBalance,
        maturingTimestamp,
        releasingTimestamp,
        maturingBalance,
        releasingBalance,
        transaction: stakingTransaction,
        withdraw,
        stake,
        unstake,
    } = useStaking(account);

    const {
        allowance,
        approve,
        balance,
        transaction: tokenTransaction,
    } = useCartesiToken(account, staking?.address, blockNumber);

    // const summary = useSummary();
    // const user = useUser(account);

    // const waiting =
    //     stakingTransaction.submitting || tokenTransaction.submitting;

    // countdown timers for maturation and release
    const maturingLeft = useTimeLeft(maturingTimestamp?.getTime());
    const releasingLeftShort = useTimeLeft(
        releasingTimestamp?.getTime(),
        2,
        true
    );

    // get most recent node hired by user (if any)
    const existingNode = useUserNode(account);

    // use a state variable for the typed node address
    const [worker, setWorker] = useState<string>();

    // priority is the typed address (at state variable)
    const activeWorker = worker || existingNode || '';

    const node = useNode(activeWorker);

    // dark mode support
    const bg = useColorModeValue('gray.50', 'header');

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
        <Layout>
            <Head>
                <title>Cartesi - Manage Node</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box
                bg="header"
                color="white"
                px={{ base: '6vw', xl: '12vw' }}
                pt={5}
            >
                <Stack
                    justify="space-between"
                    alignItems={{ base: 'flex-start', lg: 'flex-end' }}
                    direction={{ base: 'column', lg: 'row' }}
                >
                    <VStack alignItems="flex-start" pb="5">
                        <Button
                            href="/staking"
                            as="a"
                            leftIcon={<ArrowBackIcon />}
                            variant="text"
                            size="sm"
                            pl="0"
                        >
                            Back
                        </Button>
                        <Heading fontWeight="bold">Run your own node</Heading>
                        <Spacer />
                    </VStack>
                </Stack>
            </Box>
            <Box
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                py={{ base: 4, sm: 6, lg: 8 }}
                shadow="md"
            >
                {isConnected && (
                    <NodeStakingDashboard
                        userBalance={userBalance}
                        userETHBalance={userETHBalance}
                        balance={balance}
                        allowance={allowance}
                        onApprove={(amount) => {
                            approve(staking.address, amount);
                        }}
                    />
                )}
            </Box>

            <Box
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                pt={{ base: 6 }}
                bg={bg}
            >
                <VStack spacing={4} alignItems="stretch">
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
                                    ? node.transaction
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
                                    ? node.transaction
                                    : null
                            }
                        />
                    )}
                    {transactionBanners?.stake && (
                        <TransactionInfoBanner
                            title="Staking..."
                            failTitle="Error staking"
                            successDescription="Stake set sucessfully."
                            transaction={
                                currentTransaction === 'stake'
                                    ? stakingTransaction
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
                                    ? stakingTransaction
                                    : null
                            }
                        />
                    )}
                    <TransactionFeedback transaction={tokenTransaction} />
                </VStack>
            </Box>

            <Box
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                pb={{ base: 6, sm: 8, lg: 8 }}
                bg={bg}
                fontSize={'xl'}
            >
                <Stack
                    spacing={4}
                    justifyContent="space-between"
                    alignContent="flex-start"
                    mb={4}
                    direction={{ base: 'column', md: 'row' }}
                >
                    <Box>
                        <Heading as="h2" mb={0}>
                            Your Node
                        </Heading>
                        <Link href="#" isExternal fontSize="xs">
                            Learn with this tutorial <ExternalLinkIcon />
                        </Link>
                    </Box>
                </Stack>

                <NodeInfoSection
                    address={address}
                    userBalance={userBalance}
                    nodeBalance={node.balance}
                    onRetire={() => node.retire()}
                    onDeposit={(amount) => {
                        console.log('deposit...');
                        setCurrentTransaction('deposit');
                        setTransactionBanners({
                            ...transactionBanners,
                            deposit: true,
                        });
                        node.transfer(amount);
                    }}
                />

                <Stack
                    spacing={4}
                    justifyContent="space-between"
                    alignContent="flex-start"
                    mt={16}
                    mb={4}
                    direction={{ base: 'column', md: 'row' }}
                >
                    <Box>
                        <Heading as="h2" mb={0}>
                            Staking
                        </Heading>
                        <Link href="#" isExternal fontSize="xs">
                            Learn with this tutorial <ExternalLinkIcon />
                        </Link>
                    </Box>
                    {!isSmallScreen && (
                        <Box>
                            <Button
                                bgColor={bg}
                                w={{ base: '100%', md: 'auto' }}
                                minW="15rem"
                                me={2}
                                onClick={unstakeDisclosure.onOpen}
                            >
                                UNSTAKE
                            </Button>
                            <Button
                                colorScheme="blue"
                                w={{ base: '100%', md: 'auto' }}
                                minW="15rem"
                                onClick={stakeDisclosure.onOpen}
                            >
                                STAKE
                            </Button>
                        </Box>
                    )}
                </Stack>

                <TransactionFeedback transaction={stakingTransaction} />
                <TransactionFeedback transaction={node.transaction} />

                <Flex pb={12} direction={['column', 'column', 'column', 'row']}>
                    <Box flex="3">
                        <NodeMaturingSection
                            maturingBalance={maturingBalance}
                            maturingLeft={maturingLeft}
                        />
                        <NodeStakedBalanceSection
                            stakedBalance={stakedBalance}
                        />
                        <NodeReleasingSection
                            releasingBalance={releasingBalance}
                            releasingLeftShort={releasingLeftShort}
                            onWithdraw={() => {
                                setCurrentTransaction('withdraw');
                                setTransactionBanners({
                                    ...transactionBanners,
                                    withdraw: true,
                                });
                                withdraw(releasingBalance);
                            }}
                        />
                    </Box>
                </Flex>

                <NodeStakeModal
                    isOpen={stakeDisclosure.isOpen}
                    onClose={stakeDisclosure.onClose}
                    allowance={allowance}
                    disclosure={stakeDisclosure}
                    onSave={(amount) => {
                        console.log('stake transaction', toCTSI(amount));
                        setCurrentTransaction('stake');
                        setTransactionBanners({
                            ...transactionBanners,
                            stake: true,
                        });
                        stake(amount);
                    }}
                />

                {stakedBalance && (
                    <NodeUnstakeModal
                        isOpen={unstakeDisclosure.isOpen}
                        onClose={unstakeDisclosure.onClose}
                        stakedBalance={stakedBalance}
                        disclosure={unstakeDisclosure}
                        onSave={(amount) => {
                            console.log('unstake transaction', toCTSI(amount));
                            setCurrentTransaction('unstake');
                            setTransactionBanners({
                                ...transactionBanners,
                                unstake: true,
                            });
                            unstake(amount);
                        }}
                    />
                )}

                <NodeHiredBanner />
                <NodeRetiredBanner />
                <NodeHireNodeSection />
            </Box>
            {isSmallScreen && (
                <Box
                    position={'sticky'}
                    bottom={0}
                    boxShadow="0px -4px 8px rgb(47 32 27 / 4%)"
                    bgColor={stepBoxBg}
                    zIndex={theme.zIndices.sm}
                >
                    <Stack
                        py={4}
                        px={4}
                        spacing={4}
                        justifyContent="space-between"
                        direction="row"
                    >
                        <Button
                            bgColor={bg}
                            w={{ base: '100%', md: 'auto' }}
                            me={2}
                            onClick={unstakeDisclosure.onOpen}
                        >
                            UNSTAKE
                        </Button>
                        <Button
                            colorScheme="blue"
                            w={{ base: '100%', md: 'auto' }}
                            onClick={stakeDisclosure.onOpen}
                        >
                            STAKE
                        </Button>
                    </Stack>
                </Box>
            )}
        </Layout>
    );
};

export default ManageNode;
