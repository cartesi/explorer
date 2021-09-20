// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useState } from 'react';
import Head from 'next/head';

import { FixedNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { HStack, Text, Tooltip, Wrap, WrapItem } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { FaCoins, FaWallet } from 'react-icons/fa';

import Layout, { PageBody, PageHeader, PagePanel } from '../components/Layout';
import BlockMiniCard from '../components/block/BlockMiniCard';
import Users from '../components/Users';

import useBlocks from '../graphql/hooks/useBlocks';
import useSummary from '../graphql/hooks/useSummary';

import { useMarketInformation } from '../services/market';
import { useCartesiToken } from '../services/token';
import { useBlockNumber } from '../services/eth';
import { useStaking } from '../services/staking';

import { getRewardRate } from '../utils/reward';
import { toCTSI } from '../utils/token';
import labels from '../utils/labels';
import StatsPanel from '../components/home/StatsPanel';
import StatsItem from '../components/Stats';
import CTSIText from '../components/CTSIText';
import MarketInfo from '../components/MarketInfo';
import { USERS_PER_PAGE } from '../graphql/hooks/useUsers';
import SearchInput from '../components/SearchInput';
import useTotalPoolBalance from '../graphql/hooks/useTotalPoolBalance';
import SectionHeading from '../components/SectionHeading';

const Home = () => {
    // user account and blockchain information (from metamask)
    const { account, chainId } = useWeb3React<Web3Provider>();

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

    // APR calculation
    const { yearReturn } = getRewardRate(
        blocks,
        marketInformation.circulatingSupply
    );
    const participationRate = toCTSI(summary?.totalStaked || 0).divUnsafe(
        FixedNumber.from(marketInformation?.circulatingSupply || 1)
    );

    const [userSearch, setUserSearch] = useState<string>();

    return (
        <Layout>
            <Head>
                <title>Cartesi</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageHeader>
                <Wrap
                    bg="black"
                    color="white"
                    opacity={0.9}
                    justify="space-around"
                    align="flex-end"
                    px="6vw"
                    py={8}
                    wrap="wrap"
                >
                    <WrapItem p={2}>
                        <MarketInfo
                            label="CTSI Price"
                            value={marketInformation?.price}
                            unit="USD"
                        />
                    </WrapItem>
                    <WrapItem p={2}>
                        <MarketInfo
                            label="CTSI Market Cap"
                            value={marketInformation?.marketCap}
                            unit="USD"
                        />
                    </WrapItem>
                    <WrapItem p={2}>
                        <MarketInfo
                            label="Circ. Supply"
                            value={marketInformation?.circulatingSupply}
                            unit="CTSI"
                        />
                    </WrapItem>
                    <WrapItem p={2}>
                        <CTSIText
                            value={balance}
                            icon={FaWallet}
                            bg="black"
                            color="white"
                        >
                            <Text bg="black" color="white">
                                Wallet Balance
                            </Text>
                        </CTSIText>
                    </WrapItem>
                    <WrapItem p={2}>
                        <CTSIText
                            value={stakedBalance.add(poolBalance)}
                            icon={FaCoins}
                            bg="black"
                            color="white"
                        >
                            <HStack>
                                <Text bg="black" color="white">
                                    Staked Balance
                                </Text>
                                <Tooltip
                                    label="This include direct staking and pool staking"
                                    placement="top"
                                >
                                    <Icon />
                                </Tooltip>
                            </HStack>
                        </CTSIText>
                    </WrapItem>
                </Wrap>
            </PageHeader>
            <PagePanel>
                <StatsPanel w="100%" p={[5, 5, 10, 10]}>
                    <StatsItem
                        label="# Active Nodes"
                        value={summary?.totalNodes}
                    />
                    <StatsItem
                        label="Total Staked (CTSI)"
                        value={toCTSI(
                            summary?.totalStaked || 0
                        ).toUnsafeFloat()}
                        fractionDigits={2}
                        help={labels.totalStaked}
                    />
                    <StatsItem
                        label="Projected Annual Earnings"
                        value={yearReturn.toUnsafeFloat()}
                        unit="percent"
                        fractionDigits={1}
                        help={labels.projectedAnnualEarnings}
                    />
                    <StatsItem
                        label="Participation Rate"
                        value={participationRate.toUnsafeFloat()}
                        unit="percent"
                        fractionDigits={1}
                        help={labels.participationRate}
                    />
                </StatsPanel>
            </PagePanel>
            <PageBody>
                <SectionHeading>Blocks</SectionHeading>
                <Wrap justify="space-around">
                    {blocks.slice(0, 4).map((block, index) => (
                        <WrapItem key={index}>
                            <BlockMiniCard
                                chainId={chainId}
                                block={block}
                                key={block.id}
                            />
                        </WrapItem>
                    ))}
                </Wrap>
                <HStack justify="space-between" align="flex-end">
                    <SectionHeading>Block Producers</SectionHeading>
                    <SearchInput
                        w={[100, 200, 400, 500]}
                        onSearchChange={(e) => setUserSearch(e.target.value)}
                    />
                </HStack>
                <Users
                    chainId={chainId}
                    account={account}
                    search={userSearch}
                    pages={Math.ceil(
                        (summary?.totalUsers || 0) / USERS_PER_PAGE
                    )}
                />
            </PageBody>
        </Layout>
    );
};

export default Home;
