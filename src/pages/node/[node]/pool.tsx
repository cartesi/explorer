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
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    HStack,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Spacer,
    Stack,
    Switch,
    Tooltip,
    useBreakpointValue,
    useColorModeValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';

import { useBalance, useBlockNumber } from '../../../services/eth';
import { useStaking } from '../../../services/staking';
import { useCartesiToken } from '../../../services/token';
import Layout from '../../../components/Layout';
import TransactionFeedback from '../../../components/TransactionFeedback';
import { useTimeLeft } from '../../../utils/react';
import { useUserNode } from '../../../graphql/hooks/useNodes';
import { useNode } from '../../../services/node';
import { useWallet } from '../../../contexts/wallet';
import { ArrowBackIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { NodeInfoSection } from '../../../components/node/NodeInfoSection';

import { useRouter } from 'next/router';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { TransactionInfoBanner } from '../../../components/poolRedesign/TransactionInfoBanner';
import { FaBalanceScaleLeft } from 'react-icons/fa';
import theme from '../../../styles/theme';

const PoolNode: FC = () => {
    const { account, chainId, active: isConnected } = useWallet();
    const blockNumber = useBlockNumber();

    const router = useRouter();
    const address = router.query.node as string;

    const userBalance = useBalance(account);

    const {
        staking,
        maturingTimestamp,
        releasingTimestamp,
        transaction: stakingTransaction,
    } = useStaking(account);

    const {
        allowance,
        approve,
        balance,
        transaction: tokenTransaction,
    } = useCartesiToken(account, staking?.address, blockNumber);

    // get most recent node hired by user (if any)
    const existingNode = useUserNode(account);

    // use a state variable for the typed node address
    const [worker, setWorker] = useState<string>();

    // priority is the typed address (at state variable)
    const activeWorker = worker || existingNode || '';

    const node = useNode(activeWorker);

    // dark mode support
    const bg = useColorModeValue('gray.50', 'header');

    const [currentTransaction, setCurrentTransaction] = useState<any>(null);
    const [transactionBanners, setTransactionBanners] = useState<any>({});

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
                        <Spacer />
                    </VStack>
                </Stack>
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
                            Pool Node
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
            </Box>
            <Box
                px={{ base: '6vw', lg: '12vw', xl: '18vw' }}
                pb={{ base: 6, sm: 8, lg: 8 }}
                // bg={bg}
                fontSize={'xl'}
            >
                <Stack
                    spacing={4}
                    justifyContent="space-between"
                    alignContent="flex-start"
                    mt={16}
                    mb={10}
                    direction={{ base: 'column', md: 'row' }}
                >
                    <Box>
                        <Heading as="h2" mb={0}>
                            Pool Setting
                        </Heading>
                        <Link href="#" isExternal fontSize="xs">
                            Learn with this tutorial <ExternalLinkIcon />
                        </Link>
                    </Box>

                    <Box>
                        <VStack>
                            <Button
                                bgColor={'orange.100'}
                                w={{ base: '100%', md: 'auto' }}
                                minW="15rem"
                                leftIcon={<FaBalanceScaleLeft />}
                                // onClick={unstakeDisclosure.onOpen}
                            >
                                REBALANCE
                            </Button>
                            <Box fontSize={'sm'} alignSelf="flex-end">
                                Pool balance 0 CTSI{' '}
                                <Tooltip
                                    placement="bottom"
                                    label="SAMPLE TEXT"
                                    fontSize="small"
                                    bg="black"
                                    color="white"
                                >
                                    <Icon
                                        pb={1}
                                        width={4}
                                        height={4}
                                        color="gray.600"
                                    />
                                </Tooltip>
                            </Box>
                        </VStack>
                    </Box>
                </Stack>

                <Stack
                    justifySelf="flex-end"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                >
                    <FormControl>
                        <HStack justify="space-between">
                            <FormLabel>
                                Pool comission{' '}
                                <Tooltip
                                    placement="bottom"
                                    label="SAMPLE TEXT"
                                    fontSize="small"
                                    bg="black"
                                    color="white"
                                >
                                    <Icon
                                        pb={1}
                                        width={4}
                                        height={4}
                                        color="gray.600"
                                    />
                                </Tooltip>
                            </FormLabel>
                        </HStack>
                        <Stack direction={['column', 'row']}>
                            <InputGroup me={6}>
                                <Input size="lg" />
                                <InputRightElement
                                    color="gray.300"
                                    size="lg"
                                    pointerEvents="none"
                                    w={14}
                                    h="100%"
                                    children={<Box>%</Box>}
                                />
                            </InputGroup>
                            <Button
                                colorScheme="blue"
                                w={{ base: '100%', md: 'auto' }}
                                minW="15rem"
                            >
                                UPDATE
                            </Button>
                        </Stack>
                    </FormControl>
                    <FormControl>
                        <HStack justify="space-between">
                            <FormLabel>
                                Pool ENS name{' '}
                                <Tooltip
                                    placement="bottom"
                                    label="SAMPLE TEXT"
                                    fontSize="small"
                                    bg="black"
                                    color="white"
                                >
                                    <Icon
                                        pb={1}
                                        width={4}
                                        height={4}
                                        color="gray.600"
                                    />
                                </Tooltip>
                            </FormLabel>
                        </HStack>
                        <Stack direction={['column', 'row']}>
                            <InputGroup me={6}>
                                <Input size="lg" />
                            </InputGroup>
                            <Button
                                colorScheme="blue"
                                w={{ base: '100%', md: 'auto' }}
                                minW="15rem"
                            >
                                UPDATE
                            </Button>
                        </Stack>
                        <FormHelperText>
                            After registering an ENS domain and setting it up,
                            set the name here.
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <HStack mt={4} justify="space-between">
                            <FormLabel>
                                Staking{' '}
                                <Tooltip
                                    placement="bottom"
                                    label="SAMPLE TEXT"
                                    fontSize="small"
                                    bg="black"
                                    color="white"
                                >
                                    <Icon
                                        pb={1}
                                        width={4}
                                        height={4}
                                        color="gray.600"
                                    />
                                </Tooltip>
                            </FormLabel>
                        </HStack>
                        <HStack>
                            <InputGroup me={6}>
                                <Switch
                                    id="isChecked"
                                    size="lg"
                                    defaultChecked={true}
                                    me={3}
                                />
                                <FormLabel htmlFor="isChecked">
                                    Open your pool to accept new stakes
                                </FormLabel>
                            </InputGroup>
                        </HStack>
                    </FormControl>
                </Stack>

                <Box mt={10}>
                    <Divider />
                    <HStack mt={4} justify="space-between">
                        <FormLabel>
                            Decide to quit{' '}
                            <Tooltip
                                placement="bottom"
                                label="SAMPLE TEXT"
                                fontSize="small"
                                bg="black"
                                color="white"
                            >
                                <Icon
                                    pb={1}
                                    width={4}
                                    height={4}
                                    color="gray.600"
                                />
                            </Tooltip>
                        </FormLabel>
                    </HStack>
                    <FormLabel>
                        If you would like to close the pool. Please,{' '}
                        <Link href="#" color="blue.400">
                            contact us
                        </Link>{' '}
                        and we will be glad to help you.
                    </FormLabel>
                </Box>

                <TransactionFeedback transaction={stakingTransaction} />
                <TransactionFeedback transaction={node.transaction} />
            </Box>
        </Layout>
    );
};

export default PoolNode;
