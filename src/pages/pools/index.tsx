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
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import NextLink from 'next/link';
import {
    Button,
    Heading,
    HStack,
    Text,
    Tooltip,
    VStack,
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { FaCoins } from 'react-icons/fa';

import Layout, {
    PageHeader,
    PagePanel,
    PageBody,
} from '../../components/Layout';
import useSummary from '../../graphql/hooks/useSummary';
import { POOLS_PER_PAGE } from '../../graphql/hooks/useStakingPools';
import Pools from '../../containers/pool/Pools';
import SearchInput from '../../components/SearchInput';
import { useStakingPoolFactory } from '../../services/poolFactory';
import StatsPanel from '../../components/home/StatsPanel';
import usePoolBalances from '../../graphql/hooks/usePoolBalances';
import useTotalPoolBalance from '../../graphql/hooks/useTotalPoolBalance';
import CTSIText from '../../components/CTSIText';
import BigNumberText from '../../components/BigNumberText';
import UserPoolTable from '../../components/pools/UserPoolTable';
import { useBlockNumber } from '../../services/eth';
import { useCartesiToken } from '../../services/token';

const StakingPools: FC = () => {
    const { account, chainId } = useWeb3React<Web3Provider>();

    // ethereum block number (from metamask)
    const blockNumber = useBlockNumber();

    // interact with pool factory
    const { paused, loading, ready } = useStakingPoolFactory();

    // user CTSI balance
    const { balance } = useCartesiToken(account, null, blockNumber);

    // query summary data
    const summary = useSummary();

    // query total user pool balance
    const poolBalance = useTotalPoolBalance(account);

    // search pool by id
    const [search, setSearch] = useState<string>();

    // query user balances in all his pools
    const balances = usePoolBalances(account);

    return (
        <Layout>
            <Head>
                <title>Cartesi - Pools</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageHeader>
                <Heading fontWeight="normal">Staking Pools</Heading>
            </PageHeader>
            <PagePanel>
                <StatsPanel w="100%">
                    <BigNumberText value={summary?.totalPools}>
                        <HStack>
                            <Text># Pools</Text>
                            <Tooltip
                                label="Total number of pools"
                                placement="top"
                            >
                                <Icon />
                            </Tooltip>
                        </HStack>
                    </BigNumberText>
                    <BigNumberText value={balances.data?.poolBalances?.length}>
                        <HStack>
                            <Text>My Pools</Text>
                            <Tooltip
                                label="Number of pools user staked"
                                placement="top"
                            >
                                <Icon />
                            </Tooltip>
                        </HStack>
                    </BigNumberText>
                    <CTSIText value={poolBalance} icon={FaCoins}>
                        <HStack>
                            <Text>My Stake</Text>
                            <Tooltip
                                label="Total user stake in pools"
                                placement="top"
                            >
                                <Icon />
                            </Tooltip>
                        </HStack>
                    </CTSIText>
                </StatsPanel>
            </PagePanel>
            <PageBody>
                {balances.data?.poolBalances?.length > 0 && (
                    <VStack w="100%">
                        <Heading fontSize="lg">My Pools</Heading>
                        <UserPoolTable
                            chainId={chainId}
                            account={account}
                            walletBalance={balance}
                            loading={balances.loading}
                            data={balances.data?.poolBalances || []}
                        />
                    </VStack>
                )}
                <HStack justify="space-between">
                    {!loading && !paused && ready && (
                        <NextLink href="/pools/create">
                            <Button>Create Pool</Button>
                        </NextLink>
                    )}
                    <SearchInput
                        w={[100, 200, 400, 400]}
                        onSearchChange={(e) => setSearch(e.target.value)}
                    />
                </HStack>
                <Pools
                    chainId={chainId}
                    pages={Math.ceil(
                        (summary?.totalPools || 0) / POOLS_PER_PAGE
                    )}
                    account={account}
                    search={search}
                />
            </PageBody>
        </Layout>
    );
};

export default StakingPools;
