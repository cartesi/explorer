// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import Head from 'next/head';

import { FixedNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
    Center,
    Flex,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaCoins, FaWallet } from 'react-icons/fa';

import Layout from '../components/Layout';
import BlockCard from '../components/block/BlockMiniCard';
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

const SectionHeading: FunctionComponent = (props) => {
    return (
        <Heading
            as="h5"
            borderLeftWidth="1px"
            borderLeftColor="gray.900"
            borderLeftStyle="solid"
            marginTop={10}
            paddingLeft={3}
            size="lg"
            fontWeight="normal"
        >
            {props.children}
        </Heading>
    );
};

const Home = () => {
    const { marketInformation } = useMarketInformation();
    const { account } = useWeb3React<Web3Provider>();
    const blockNumber = useBlockNumber();
    const { balance } = useCartesiToken(account, null, blockNumber);
    const { stakedBalance } = useStaking(account);
    const summary = useSummary();
    const { data } = useBlocks();
    const blocks = data?.blocks || [];
    const { yearReturn } = getRewardRate(
        blocks,
        marketInformation.circulatingSupply
    );
    const participationRate = toCTSI(summary?.totalStaked || 0).divUnsafe(
        FixedNumber.from(marketInformation?.circulatingSupply || 1)
    );

    return (
        <Layout>
            <Head>
                <title>Cartesi</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Flex
                direction={['column', 'column', 'column', 'row']}
                align={['flex-start', 'flex-start', 'flex-start', 'flex-end']}
                justify="space-around"
                bg="black"
                color="white"
                opacity={0.87}
                p="50px 6vw 50px 6vw"
            >
                <MarketInfo
                    label="CTSI Price"
                    value={marketInformation?.price}
                    unit="USD"
                />
                <MarketInfo
                    label="CTSI Market Cap"
                    value={marketInformation?.marketCap}
                    unit="USD"
                />
                <MarketInfo
                    label="Circ. Supply"
                    value={marketInformation?.circulatingSupply}
                    unit="CTSI"
                />
                <CTSIText
                    label="Wallet Balance"
                    value={balance}
                    icon={FaWallet}
                    bg="black"
                    color="white"
                />
                <CTSIText
                    label="Staked Balance"
                    value={stakedBalance}
                    icon={FaCoins}
                    bg="black"
                    color="white"
                />
            </Flex>
            <Center
                p="0 6vw"
                bgGradient="linear(to-b, rgba(0,0,0,.87) 0%, rgba(0,0,0,.87) 50%, white 50%, white 100%)"
            >
                <StatsPanel w="100%">
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
            </Center>
            <HStack p="0 6vw">
                <SectionHeading>Blocks</SectionHeading>
            </HStack>
            <Wrap p="20px 6vw" justify="space-around">
                {blocks.slice(0, 4).map((block) => (
                    <WrapItem>
                        <BlockCard block={block} key={block.id} />
                    </WrapItem>
                ))}
            </Wrap>

            <HStack p="20px 6vw" justify="space-between" align="flex-end">
                <SectionHeading>Block Producers</SectionHeading>
                <SearchInput w={[100, 200, 400, 400]} />
            </HStack>
            <HStack p="20px 6vw" justify="space-between">
                <Users
                    account={account}
                    pages={Math.ceil(
                        (summary?.totalUsers || 0) / USERS_PER_PAGE
                    )}
                />
            </HStack>
        </Layout>
    );
};

export default Home;
