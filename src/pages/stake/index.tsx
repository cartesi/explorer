// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import Head from 'next/head';

import { FixedNumber } from 'ethers';
import {
    HStack,
    Stack,
    Text,
    Tooltip,
    Wrap,
    WrapItem,
    SimpleGrid,
    chakra,
    Heading,
    Box,
    useColorModeValue,
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { FaCoins, FaWallet } from 'react-icons/fa';
import { useFlag } from '@unleash/proxy-client-react';
import { useRouter } from 'next/router';

import Layout, {
    PageBody,
    PageHeader,
    PagePanel,
} from '../../components/Layout';
import BlockMiniCard from '../../components/block/BlockMiniCard';
import Users from '../../components/Users';

import useBlocks from '../../graphql/hooks/useBlocks';
import useSummary from '../../graphql/hooks/useSummary';

import { useMarketInformation } from '../../services/market';
import { useCartesiToken } from '../../services/token';
import { useBlockNumber } from '../../services/eth';
import { useStaking } from '../../services/staking';
import { useWallet } from '../../contexts/wallet';

import { getRewardRate } from '../../utils/reward';
import { toCTSI } from '../../utils/token';
import labels from '../../utils/labels';
import StatsPanel from '../../components/home/StatsPanel';
import StatsItem from '../../components/Stats';
import CTSIText from '../../components/CTSIText';
import MarketInfo from '../../components/MarketInfo';
import { USERS_PER_PAGE } from '../../graphql/hooks/useUsers';
import SearchInput from '../../components/SearchInput';
import useTotalPoolBalance from '../../graphql/hooks/useTotalPoolBalance';
import SectionHeading from '../../components/SectionHeading';
import BigNumberText from '../../components/BigNumberText';
import StakeCard from '../../components/stake/StakeCard';
import usePoolBalances from '../../graphql/hooks/usePoolBalances';
import PoolsOverview from '../../components/stake/components/PoolsOverview';
import UserStakingPools from '../../components/stake/UserStakingPoolsTable';

const Home = () => {
    const router = useRouter();

    // user account and blockchain information (from metamask or other wallets)
    const { account, chainId } = useWallet();

    // ethereum block number (from metamask)
    const blockNumber = useBlockNumber();

    // user CTSI balance
    const { balance } = useCartesiToken(account, null, blockNumber);

    // user staked balance
    const { stakedBalance } = useStaking(account);

    // query total pool balance
    const poolBalance = useTotalPoolBalance(account);

    // global summary information
    const summary = useSummary();

    // CTSI market information (from coingecko)
    const { marketInformation } = useMarketInformation();

    // latest 4 produced blocks
    const { data } = useBlocks({}, 4);
    const blocks = data?.blocks || [];
    const balances = usePoolBalances(account);

    // APR calculation
    const { yearReturn } = getRewardRate(
        blocks,
        marketInformation.circulatingSupply
    );
    const participationRate = toCTSI(summary?.totalStaked || 0).divUnsafe(
        FixedNumber.from(marketInformation?.circulatingSupply || 1)
    );

    const [userSearch, setUserSearch] = useState<string>();
    const newPoolPageEnabled = useFlag('newPoolPageEnabled');
    const bg = useColorModeValue('gray.80', 'header');

    useEffect(() => {
        // When the flag is off, the user is automatically redirected to /pool
        // The replace method overrides the current URL with the new one.
        if (!newPoolPageEnabled) {
            router.replace('/pool');
        }
    }, [newPoolPageEnabled, router]);

    return (
        <Layout>
            <Head>
                <title>Explorer - Pool List</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <PageHeader>
                <Box bg="header" color="white" px={{ base: '6vw', xl: '6vw' }}>
                    <Heading as="h1" fontSize={['4xl', '5xl']}>
                        Pools
                    </Heading>
                </Box>
            </PageHeader>

            <PagePanel>
                <PoolsOverview />
            </PagePanel>

            <PageBody>
                <Box px={{ base: '6vw', xl: '6vw' }}>
                    <Heading as="h2">My staking pools</Heading>
                    <UserStakingPools
                        chainId={chainId}
                        walletBalance={balance}
                        loading={balances.loading}
                        data={balances.data?.poolBalances || []}
                    />
                </Box>
            </PageBody>
        </Layout>
    );
};

export default Home;
