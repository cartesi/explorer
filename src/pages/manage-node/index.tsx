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
    HStack,
    Icon,
    IconButton,
    Link,
    Spacer,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { FaCoins, FaTrophy, FaWallet } from 'react-icons/fa';
import { BsClockHistory } from 'react-icons/bs';
import { AiOutlineDollar } from 'react-icons/ai';

import { useBalance, useBlockNumber } from '../../services/eth';
import { useStaking } from '../../services/staking';
import { useCartesiToken } from '../../services/token';
import useUser from '../../graphql/hooks/useUser';
import Layout, {
    PageBody,
    PageHeader,
    PagePanel,
} from '../../components/Layout';
import StakingDisclaimer from '../../components/StakingDisclaimer';
import StakingTabs from '../../components/staking/Tabs';
import UnstakeForm from '../../components/staking/UnstakeForm';
import StakeForm from '../../components/staking/StakeForm';
import useSummary from '../../graphql/hooks/useSummary';
import TransactionFeedback from '../../components/TransactionFeedback';
import CTSIText from '../../components/CTSIText';
import { useTimeLeft } from '../../utils/react';
import { useUserNode } from '../../graphql/hooks/useNodes';
import { useNode } from '../../services/node';
import Node from '../../components/node/Node';
import labels from '../../utils/labels';
import TermsCondition from '../../components/TermsCondition';
import { useWallet } from '../../contexts/wallet';
import { ArrowBackIcon, EditIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { StakingDashboard } from '../../components/poolRedesign/StakingDashboard';
import { StakingGuide } from '../../components/poolRedesign/StakingGuide';
import { useRouter } from 'next/router';
import Address from '../../components/Address';
import { CTSINumberInput } from '../../components/poolRedesign/CTSINumberInput';
import { formatUnits } from 'ethers/lib/utils';
import { AllowanceIcon } from '../../components/Icons';
import CTSI from '../../components/pools/staking/CTSI';

const ManageNode: FC = () => {
    const { account, chainId, active: isConnected } = useWallet();
    const blockNumber = useBlockNumber();

    const router = useRouter();
    const address = router.query.pool as string;

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

    const summary = useSummary();
    const user = useUser(account);

    const waiting =
        stakingTransaction.submitting || tokenTransaction.submitting;

    // countdown timers for maturation and release
    const maturingLeft = useTimeLeft(maturingTimestamp?.getTime());
    const releasingLeft = useTimeLeft(releasingTimestamp?.getTime());

    // get most recent node hired by user (if any)
    const existingNode = useUserNode(account);

    // use a state variable for the typed node address
    const [worker, setWorker] = useState<string>();

    // priority is the typed address (at state variable)
    const activeWorker = worker || existingNode || '';

    const node = useNode(activeWorker);

    const nodeBalanceFormatted = parseFloat(formatUnits(5, 18));

    // dark mode support
    const bg = useColorModeValue('gray.50', 'header');

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
                        <Heading fontWeight="normal">Run your own node</Heading>
                        <Spacer />
                    </VStack>
                </Stack>
            </Box>
            <Box
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                py={{ base: 8, sm: 12, lg: 16 }}
                shadow="md"
            >
                {isConnected ? (
                    <StakingDashboard
                        userBalance={userBalance}
                        userETHBalance={userETHBalance}
                        balance={balance}
                        allowance={allowance}
                        onApprove={(amount) => approve(address, amount)}
                    />
                ) : (
                    <StakingGuide />
                )}
            </Box>
            {/* <PagePanel>
                <Node
                    chainId={chainId}
                    account={account}
                    address={activeWorker}
                    p={[5, 5, 10, 10]}
                    user={node.user}
                    balance={node.balance}
                    userBalance={userBalance}
                    available={node.available}
                    pending={node.pending}
                    owned={node.owned}
                    retired={node.retired}
                    authorized={node.authorized}
                    onAddressChange={setWorker}
                    onHire={(worker, amount) => node.hire(amount)}
                    onCancelHire={() => node.cancelHire()}
                    onRetire={() => node.retire()}
                    onTransfer={(worker, amount) => node.transfer(amount)}
                />
            </PagePanel> */}

            <Box
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                py={{ base: 8, sm: 12, lg: 16 }}
            >
                <Stack
                    spacing={4}
                    justifyContent="space-between"
                    alignContent="flex-start"
                    mb={8}
                    direction={{ base: 'column', md: 'row' }}
                >
                    <Box>
                        <Heading as="h2" size="lg" mb={0}>
                            Your Node
                        </Heading>
                        <Link href="#" isExternal fontSize="xs">
                            Learn with this tutorial <ExternalLinkIcon />
                        </Link>
                    </Box>
                </Stack>

                <Box
                    bgColor="white"
                    shadow="base"
                    px={{ base: 2, lg: 4, xl: 8 }}
                    py={{ base: 2, sm: 4, lg: 8 }}
                    mb={6}
                >
                    <Stack
                        spacing={4}
                        justifyContent="space-between"
                        alignContent="flex-start"
                        direction={{ base: 'column', md: 'row' }}
                    >
                        <Text>Address</Text>
                        <Address
                            noActions={true}
                            address="0xb00299b573a9deee20e6a242416188d1033e325f"
                        ></Address>
                    </Stack>
                    <Stack
                        spacing={4}
                        justifyContent="space-between"
                        alignContent="flex-start"
                        direction={{ base: 'column', md: 'row' }}
                    >
                        <Text>Deposit Funds</Text>
                        <HStack spacing={4} alignItems="flex-end" p={4}>
                            <Box>
                                <Heading m={0} size="lg">
                                    <Flex align="baseline">
                                        <CTSI value={allowance} />
                                        <Text>CTSI</Text>
                                    </Flex>
                                </Heading>
                            </Box>
                            <Box alignSelf="flex-end">
                                <IconButton
                                    aria-label="Edit"
                                    size="sm"
                                    icon={<EditIcon />}
                                    variant="ghost"
                                    // onClick={onAllowanceClick}
                                />
                            </Box>
                        </HStack>
                    </Stack>
                </Box>

                <Stack
                    spacing={4}
                    justifyContent="space-between"
                    alignContent="flex-start"
                    mb={8}
                    direction={{ base: 'column', md: 'row' }}
                >
                    <Box>
                        <Heading as="h2" size="lg" mb={0}>
                            Staking
                        </Heading>
                        <Link href="#" isExternal fontSize="xs">
                            Learn with this tutorial <ExternalLinkIcon />
                        </Link>
                    </Box>
                    <Box>
                        <Button
                            // onClick={onDepositClick}
                            bgColor={bg}
                            w={{ base: '100%', md: 'auto' }}
                            minW="15rem"
                            me={2}
                            // disabled={
                            //     allowance.isZero() ||
                            //     userWalletBalance.isZero() ||
                            //     userETHBalance?.isZero()
                            // }
                        >
                            Unstake
                        </Button>
                        <Button
                            colorScheme="blue"
                            // onClick={onDepositClick}
                            w={{ base: '100%', md: 'auto' }}
                            minW="15rem"
                            // disabled={
                            //     allowance.isZero() ||
                            //     userWalletBalance.isZero() ||
                            //     userETHBalance?.isZero()
                            // }
                        >
                            Stake
                        </Button>
                    </Box>
                </Stack>

                <TransactionFeedback transaction={tokenTransaction} />
                <TransactionFeedback transaction={stakingTransaction} />
                <TransactionFeedback transaction={node.transaction} />
                <Flex direction={['column', 'column', 'column', 'row']}>
                    <Box flex="3" pr={[0, 0, 0, 8]} mb={[8, 8, 8, 0]}>
                        <Box
                            mb={8}
                            shadow="lg"
                            borderLeftWidth={10}
                            borderLeftColor="gray.900"
                            bg={bg}
                        >
                            <CTSIText
                                p={6}
                                value={BigNumber.from(user?.totalReward || 0)}
                                icon={FaTrophy}
                                direction="row"
                            >
                                <HStack>
                                    <Text>Total Rewards!</Text>
                                    <Tooltip
                                        label={labels.totalRewards}
                                        placement="top"
                                    >
                                        <Icon />
                                    </Tooltip>
                                </HStack>
                            </CTSIText>
                        </Box>
                        <Box
                            mb={8}
                            boxShadow="lg"
                            borderLeftWidth={10}
                            borderLeftColor="gray.900"
                            bg={bg}
                        >
                            <CTSIText
                                p={6}
                                value={maturingBalance}
                                icon={BsClockHistory}
                                direction="row"
                            >
                                <Text>Maturing</Text>
                                {maturingBalance.gt(0) && maturingLeft && (
                                    <Text fontSize="sm">
                                        {maturingLeft} to mature
                                    </Text>
                                )}
                            </CTSIText>
                            <CTSIText
                                p={6}
                                value={stakedBalance}
                                icon={FaCoins}
                                direction="row"
                            >
                                <Text>Staked</Text>
                            </CTSIText>
                        </Box>

                        <Box
                            mb={8}
                            boxShadow="lg"
                            borderLeftWidth={10}
                            borderLeftColor="gray.900"
                            bg={bg}
                        >
                            <CTSIText
                                p={6}
                                value={releasingBalance}
                                icon={AiOutlineDollar}
                                direction="row"
                            >
                                {releasingLeft && <Text>Releasing</Text>}
                                {!releasingLeft && <Text>Released</Text>}
                                {releasingBalance.gt(0) && releasingLeft && (
                                    <Text fontSize="sm">
                                        {releasingLeft} to release
                                    </Text>
                                )}
                                {releasingBalance.gt(0) && !releasingLeft && (
                                    <Button
                                        size="sm"
                                        disabled={!account || waiting}
                                        onClick={() =>
                                            withdraw(releasingBalance)
                                        }
                                    >
                                        Withdraw
                                    </Button>
                                )}
                            </CTSIText>
                        </Box>
                    </Box>

                    <StakingTabs
                        flex={2}
                        bg={bg}
                        Stake={
                            <StakeForm
                                allowance={allowance}
                                releasing={releasingBalance}
                                totalStaked={BigNumber.from(
                                    summary?.totalStaked || '0'
                                )}
                                disabled={!account || waiting}
                                onApprove={(amount) =>
                                    approve(staking.address, amount)
                                }
                                onStake={stake}
                            />
                        }
                        Unstake={
                            <UnstakeForm
                                maturing={maturingBalance}
                                staked={stakedBalance}
                                onUnstake={unstake}
                                disabled={!account || waiting}
                            />
                        }
                    />
                </Flex>
            </Box>
        </Layout>
    );
};

export default ManageNode;
