// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
    Center,
    FormControl,
    FormLabel,
    HStack,
    Switch,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';

import { useStakingPool } from '../../../services/pool';
import useStakingPoolQuery from '../../../graphql/hooks/useStakingPool';
import Layout from '../../../components/Layout';
import PoolNode from '../../../components/pools/PoolNode';
import AddressText from '../../../components/AddressText';
import TransactionFeedback from '../../../components/TransactionFeedback';
import NameForm from '../../../components/pools/NameForm';
import FlatRateContainer from '../../../containers/pool/FlatRateContainer';
import GasTaxContainer from '../../../containers/pool/GasTaxContainer';
import Rebalance from '../../../components/pools/Rebalance';

const ManagePool = () => {
    const router = useRouter();
    const { pool } = router.query;
    const { account, chainId } = useWeb3React<Web3Provider>();

    const {
        setName,
        pause,
        unpause,
        rebalance,
        paused,
        amounts,
        transaction: poolTransaction,
    } = useStakingPool(pool as string, account);

    const stakingPool = useStakingPoolQuery(pool as string);

    // infer fee type from graphql data (not contract)
    const feeType =
        stakingPool?.fee?.commission != null
            ? 'flatRate'
            : stakingPool?.fee?.gas != null
            ? 'gasTax'
            : undefined;

    // dark mode compatible background color
    const bgColor = useColorModeValue('white', 'gray.800');

    return (
        <Layout>
            <Head>
                <title>Cartesi - Edit Pool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <HStack
                px="6vw"
                py={5}
                justify="space-between"
                align="flex-end"
                bg="black"
                opacity={0.87}
                color="white"
            >
                <AddressText
                    address={stakingPool?.id}
                    chainId={chainId}
                    icon={FaUsers}
                >
                    <Text>Staking Pool</Text>
                </AddressText>
            </HStack>

            <Center
                px="6vw"
                bgGradient={`linear(to-b, rgba(0,0,0,.87) 0%, rgba(0,0,0,.87) 50%, ${bgColor} 50%, ${bgColor} 100%)`}
            >
                <PoolNode poolAddress={pool as string} />
            </Center>
            <VStack px="6vw" py={10} spacing={5}>
                <TransactionFeedback transaction={poolTransaction} />
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="pause" mb="0">
                        Pool accepting new stakes?
                    </FormLabel>
                    <Switch
                        id="pause"
                        size="lg"
                        isChecked={!paused}
                        onChange={paused ? unpause : pause}
                    />
                </FormControl>
                <NameForm onSetName={setName} />
                {feeType == 'flatRate' && (
                    <FlatRateContainer pool={pool as string} />
                )}
                {feeType == 'gasTax' && (
                    <GasTaxContainer pool={pool as string} />
                )}
                <Rebalance
                    w="100%"
                    stake={amounts?.stake}
                    unstake={amounts?.unstake}
                    withdraw={amounts?.withdraw}
                    onRebalance={rebalance}
                />
            </VStack>
        </Layout>
    );
};

export default ManagePool;
