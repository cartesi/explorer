// Copyright (C) 2021 Cartesi Pte. Ltd.

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
    Spacer,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
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

const Staking: FC = () => {
    const { account, chainId } = useWallet();
    const blockNumber = useBlockNumber();

    // user ETH balance
    const userBalance = useBalance(account);

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

    // dark mode support
    const bg = useColorModeValue('white', 'gray.700');

    return (
        <Layout>
            <Head>
                <title>Cartesi - Staking</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageHeader>
                <Flex wrap="wrap">
                    <Heading fontWeight="normal">Staking</Heading>
                    <Spacer />
                    <Stack
                        direction={['column', 'column', 'row', 'row']}
                        spacing={[5, 5, 10, 10]}
                    >
                        <CTSIText value={balance} icon={FaWallet}>
                            <Text>Wallet Balance</Text>
                        </CTSIText>

                        <CTSIText value={stakedBalance} icon={FaCoins}>
                            <Text>Staked Balance</Text>
                        </CTSIText>
                    </Stack>
                </Flex>
            </PageHeader>
            <PagePanel>
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
            </PagePanel>
            <PageBody>
                <TermsCondition persistanceKey="stakingTermsAccepted" />
                <StakingDisclaimer persistanceKey="readDisclaimer" />
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
                                    <Text>Total Rewards</Text>
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
            </PageBody>
        </Layout>
    );
};

export default Staking;
