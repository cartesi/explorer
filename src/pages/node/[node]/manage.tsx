// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Link,
    Spinner,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { AiOutlineLeft } from 'react-icons/ai';

import { useBalance, useBlockNumber } from '../../../services/eth';
import { useStaking } from '../../../services/staking';
import { useCartesiToken } from '../../../services/token';
import Layout from '../../../components/Layout';
import { useTimeLeft } from '../../../utils/react';
import { useUserNode } from '../../../graphql/hooks/useNodes';
import { useNode } from '../../../services/node';
import { useWallet } from '../../../contexts/wallet';
import { NodeStakingDashboard } from '../../../components/node/NodeStakingDashboard';
import { NodeMaturingSection } from '../../../components/node/NodeMaturingSection';
import { NodeReleasingSection } from '../../../components/node/NodeReleasingSection';
import { NodeInfoSection } from '../../../components/node/NodeInfoSection';
import { NodeStakedBalanceSection } from '../../../components/node/NodeStakedBalanceSection';
import { NodeUnstakeModal } from '../../../components/node/modals/NodeUnstakeModal';
import { NodeStakeModal } from '../../../components/node/modals/NodeStakeModal';
import { TransactionInfoBanner } from '../../../components/stake/TransactionInfoBanner';
import theme from '../../../styles/theme';

const ManageNode: FC = () => {
    const { account, active: isConnected } = useWallet();
    const blockNumber = useBlockNumber();
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const stepBoxBg = useColorModeValue('white', 'gray.700');

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

    // countdown timers for maturation and release
    const maturingLeft = useTimeLeft(maturingTimestamp?.getTime());
    const releasingLeftShort = useTimeLeft(releasingTimestamp?.getTime(), 2);

    // get most recent node hired by user (if any)
    const existingNode = useUserNode(account);

    // use a state variable for the typed node address
    const [worker, setWorker] = useState<string>();
    const [hiringFunds, setHiringFunds] = useState<BigNumber>(
        BigNumber.from(0)
    );

    // priority is the typed address (at state variable)
    const activeWorker = worker || existingNode || '';

    const node = useNode(activeWorker);

    // dark mode support
    const bg = useColorModeValue('gray.80', 'header');

    const stakeDisclosure = useDisclosure();
    const unstakeDisclosure = useDisclosure();

    const [isRetiring, setRetiring] = useState<boolean>(false);
    const [isHiring, setHiring] = useState<boolean>(false);
    const [isRetired, setRetired] = useState<boolean>(node.retired);
    const [currentTransaction, setCurrentTransaction] = useState<any>(null);
    const [isRetireAlertActive, setRetireAlertActive] =
        useState<boolean>(false);
    const [isHireAlertActive, setHireAlertActive] = useState<boolean>(false);
    const [isDepositAlertActive, setDepositAlertActive] =
        useState<boolean>(false);
    const [isWithdrawAlertActive, setWithdrawAlertActive] =
        useState<boolean>(false);
    const [isStakeAlertActive, setStakeAlertActive] = useState<boolean>(false);
    const [isUnstakeAlertActive, setUnstakeAlertActive] =
        useState<boolean>(false);
    const isInitialLoading = useRef<boolean>(true);
    const isStakeUnstakeDisabled = node.retired || !node.owned || isRetiring;
    const hiredNewNode =
        currentTransaction === 'hire' &&
        node.transaction?.state === 'confirmed';

    useEffect(() => {
        if (hiredNewNode) {
            window.history.pushState(
                null,
                '',
                `${window.origin}/node/${activeWorker}/manage`
            );
        }
    }, [hiredNewNode, activeWorker]);

    useEffect(() => {
        if (
            hiringFunds.gt(BigNumber.from(0)) &&
            currentTransaction === 'hire'
        ) {
            node.hire(hiringFunds);
            setHiringFunds(BigNumber.from(0));
        }
    }, [node, hiringFunds, currentTransaction]);

    useEffect(() => {
        if (node.transaction?.state === 'confirmed') {
            setCurrentTransaction(null);
        }
    }, [node.transaction]);

    useEffect(() => {
        if (node.ready && isInitialLoading.current) {
            setRetired(node.retired);
            isInitialLoading.current = false;
        }
    }, [node]);

    return (
        <Layout>
            <Head>
                <title>Explorer - Manage Node</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <HStack
                bg="header"
                color="white"
                px={{ base: '6vw', xl: '10vw' }}
                pt={5}
            >
                <Link href="/newStaking" passHref>
                    <Box as="a" display="flex" alignItems="center">
                        <Box as={AiOutlineLeft} mr={1} />
                        <Text>Back</Text>
                    </Box>
                </Link>
            </HStack>

            <Box
                bg="header"
                color="white"
                px={{ base: '6vw', xl: '12vw' }}
                pt={0}
                pb={10}
            >
                <Stack alignItems={'flex-start'} direction={'row'}>
                    <Heading as="h1" fontSize={{ base: '4xl', xl: '5xl' }}>
                        Run your own node
                    </Heading>
                </Stack>
            </Box>

            {isConnected && (
                <Box
                    px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                    py={{ base: 4, sm: 6, lg: '26px' }}
                    shadow="md"
                    position="relative"
                >
                    <NodeStakingDashboard
                        userBalance={userBalance}
                        userETHBalance={userETHBalance}
                        balance={balance}
                        allowance={allowance}
                        onApprove={(amount) => {
                            approve(staking.address, amount);
                        }}
                    />
                </Box>
            )}

            <Box
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                pt={{ base: 8 }}
                bg={bg}
                pb={4}
            >
                <VStack spacing={4} alignItems="stretch">
                    <TransactionInfoBanner
                        title="Setting allowance..."
                        failTitle="Error setting allowance"
                        successDescription="New allowance set successfully."
                        transaction={tokenTransaction}
                    />

                    {isDepositAlertActive && (
                        <TransactionInfoBanner
                            title="Setting deposit..."
                            failTitle="Error setting deposit"
                            successDescription="New deposit set successfully."
                            transaction={node.transaction}
                            onClose={() => setDepositAlertActive(false)}
                        />
                    )}

                    {isRetireAlertActive && (
                        <TransactionInfoBanner
                            title="Retiring Node..."
                            failTitle="Error retiring the node"
                            successDescription="Node retired successfully."
                            transaction={node.transaction}
                            onSuccess={() => {
                                setRetiring(false);
                                setRetired(true);
                            }}
                            onError={() => {
                                setRetiring(false);
                                setRetired(false);
                            }}
                            onClose={() => setRetireAlertActive(false)}
                        />
                    )}

                    {isHireAlertActive && (
                        <TransactionInfoBanner
                            title="Hiring node..."
                            failTitle="Error hiring node"
                            successDescription="Node hired successfully."
                            transaction={node.transaction}
                            onSuccess={() => {
                                setHiring(false);
                                setRetired(false);
                            }}
                            onError={() => {
                                setHiring(false);
                                setRetired(true);
                            }}
                            onClose={() => setHireAlertActive(false)}
                        />
                    )}
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
                    </Box>
                </Stack>

                {!node.ready ? (
                    <Box
                        bg={bg}
                        px={{ base: 2, lg: 8 }}
                        py={{ base: 2, lg: 6 }}
                        display="flex"
                        justifyContent="center"
                    >
                        <Spinner size="xl" color="white" />
                    </Box>
                ) : (
                    <NodeInfoSection
                        address={activeWorker}
                        userBalance={userBalance}
                        nodeBalance={node.balance}
                        isRetired={isRetired}
                        isRetiring={isRetiring}
                        isHiring={isHiring}
                        onRetire={() => {
                            setCurrentTransaction('retire');
                            setRetireAlertActive(true);
                            setRetiring(true);

                            node.retire();
                        }}
                        onDeposit={(amount) => {
                            setCurrentTransaction('deposit');
                            setDepositAlertActive(true);
                            node.transfer(amount);
                        }}
                        onHire={(nodeAddress, funds) => {
                            setCurrentTransaction('hire');
                            setHireAlertActive(true);
                            setHiring(true);
                            setRetiring(false);
                            setWorker(nodeAddress);
                            setHiringFunds(funds);
                        }}
                    />
                )}

                <Stack
                    spacing={4}
                    justifyContent="space-between"
                    alignContent="flex-start"
                    alignItems="center"
                    mt={10}
                    mb={4}
                    direction={{ base: 'column', md: 'row' }}
                >
                    <Box>
                        <Heading as="h2" mb={0}>
                            Staking
                        </Heading>
                    </Box>

                    {!isSmallScreen && (
                        <Box>
                            <Button
                                bgColor={bg}
                                color="gray.450"
                                w={{ base: '100%', md: 'auto' }}
                                minW="173px"
                                me={2}
                                fontWeight={600}
                                textTransform="uppercase"
                                letterSpacing="0.5px"
                                disabled={isStakeUnstakeDisabled}
                                onClick={unstakeDisclosure.onOpen}
                            >
                                Unstake
                            </Button>
                            <Button
                                colorScheme="blue"
                                w={{ base: '100%', md: 'auto' }}
                                minW="173px"
                                fontWeight={600}
                                textTransform="uppercase"
                                letterSpacing="0.5px"
                                disabled={isStakeUnstakeDisabled}
                                onClick={stakeDisclosure.onOpen}
                            >
                                Stake
                            </Button>
                        </Box>
                    )}
                </Stack>

                <Box bg={bg}>
                    <VStack spacing={4} alignItems="stretch">
                        {isWithdrawAlertActive && (
                            <TransactionInfoBanner
                                title="Withdrawing..."
                                failTitle="Error withdrawing"
                                successDescription="Withdrawed successfully."
                                transaction={stakingTransaction}
                                onClose={() => setWithdrawAlertActive(false)}
                            />
                        )}

                        {isStakeAlertActive && (
                            <TransactionInfoBanner
                                title="Staking..."
                                failTitle="Error staking"
                                successDescription="Stake set successfully."
                                transaction={stakingTransaction}
                                onClose={() => setStakeAlertActive(false)}
                            />
                        )}

                        {isUnstakeAlertActive && (
                            <TransactionInfoBanner
                                title="Unstaking..."
                                failTitle="Error unstaking"
                                successDescription="Unstaked successfully."
                                transaction={stakingTransaction}
                                onClose={() => setUnstakeAlertActive(false)}
                            />
                        )}
                    </VStack>
                </Box>

                <Flex
                    mt={4}
                    pb={12}
                    direction={['column', 'column', 'column', 'row']}
                >
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
                                setWithdrawAlertActive(true);
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
                        setCurrentTransaction('stake');
                        setStakeAlertActive(true);
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
                            setCurrentTransaction('unstake');
                            setUnstakeAlertActive(true);
                            unstake(amount);
                        }}
                    />
                )}
            </Box>

            {isSmallScreen && (
                <Box
                    position="sticky"
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
                            disabled={isStakeUnstakeDisabled}
                            onClick={unstakeDisclosure.onOpen}
                        >
                            UNSTAKE
                        </Button>
                        <Button
                            colorScheme="blue"
                            w={{ base: '100%', md: 'auto' }}
                            disabled={isStakeUnstakeDisabled}
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
