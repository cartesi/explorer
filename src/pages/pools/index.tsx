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
import { Button, HStack, VStack } from '@chakra-ui/react';

import Layout from '../../components/Layout';
import useSummary from '../../graphql/hooks/useSummary';
import PageHeader from '../../components/PageHeader';
import { POOLS_PER_PAGE } from '../../graphql/hooks/useStakingPools';
import Pools from '../../containers/pool/Pools';
import SearchInput from '../../components/SearchInput';
import { useStakingPoolFactory } from '../../services/poolFactory';
import StatsPanel from '../../components/home/StatsPanel';
import StatsItem from '../../components/Stats';
import usePoolBalances from '../../graphql/hooks/usePoolBalances';

const StakingPools: FC = () => {
    const { account, chainId } = useWeb3React<Web3Provider>();

    // interact with pool factory
    const { paused, loading, ready } = useStakingPoolFactory();

    // query summary data
    const summary = useSummary();

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

            <PageHeader title="Staking Pools" />

            <VStack p="20px 6vw" align="stretch" spacing={5}>
                <StatsPanel>
                    <StatsItem
                        label="# Pools"
                        value={summary?.totalPools}
                        fractionDigits={0}
                        help="Total number of pools"
                    />
                    <StatsItem
                        label="My Pools"
                        value={balances.data?.poolBalances?.length}
                        fractionDigits={0}
                        help="Number of pools user staked"
                    />
                </StatsPanel>

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
            </VStack>
        </Layout>
    );
};

export default StakingPools;
