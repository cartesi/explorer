// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import Head from 'next/head';
import { NextRouter, withRouter } from 'next/router';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import Layout from '../../components/Layout';
import useSummary from '../../graphql/hooks/useSummary';
import PageHeader from '../../components/PageHeader';
import { POOLS_PER_PAGE } from '../../graphql/hooks/useStakingPools';
import Pools from '../../components/Pools';
import SearchInput from '../../components/SearchInput';
import { useStakingPoolFactory } from '../../services/poolFactory';
import { Button, HStack, Link, VStack } from '@chakra-ui/react';

interface PoolsProps {
    router: NextRouter;
}

const StakingPools: FunctionComponent<PoolsProps> = ({ router }) => {
    const { account, chainId } = useWeb3React<Web3Provider>();
    const { paused, loading, ready } = useStakingPoolFactory();
    const summary = useSummary();

    return (
        <Layout>
            <Head>
                <title>Cartesi - Pools</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PageHeader title="Staking Pools" />

            <VStack p="20px 6vw" align="stretch">
                <HStack justify="space-between">
                    {!loading && !paused && ready && (
                        <Link href="/pools/create">
                            <Button>Create Pool</Button>
                        </Link>
                    )}
                    <SearchInput w={[100, 200, 400, 400]} bg="gray.200" />
                </HStack>
                <Pools
                    chainId={chainId}
                    pages={Math.ceil(
                        (summary?.totalPools || 0) / POOLS_PER_PAGE
                    )}
                    account={account}
                />
            </VStack>
        </Layout>
    );
};

export default withRouter(StakingPools);
