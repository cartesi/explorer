// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Icon } from '@chakra-ui/icons';
import {
    Box,
    Flex,
    Heading,
    HStack,
    IconProps,
    SimpleGrid,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import {
    Banner,
    ActiveNodeIcon,
    ChartIcon,
    CircleSupplyIcon,
    GridIcon,
    MarketCapICon,
    PrizeIcon,
    TotalStakedIcon,
} from '@explorer/ui';
import { useWallet } from '@explorer/wallet';
import { FixedNumber } from 'ethers';
import { FC, useState } from 'react';
import BlockMiniCard from '../components/block/BlockMiniCard';
import CTSIText from '../components/CTSIText';
import MarketInfoPanel from '../components/home/MarketInfoPanel';
import PrimaryCard from '../components/home/PrimaryCard';
import Layout from '../components/Layout';
import PageHead from '../components/PageHead';
import SearchInput from '../components/SearchInput';
import Users from '../components/Users';
import useBlocks from '../graphql/hooks/useBlocks';
import useSummary from '../graphql/hooks/useSummary';
import useTotalPoolBalance from '../graphql/hooks/useTotalPoolBalance';
import { useBlockNumber } from '../services/eth';
import { useMarketInformation } from '../services/market';
import { useStaking } from '../services/staking';
import { useCartesiToken } from '../services/token';
import { formatNumberValue } from '../utils/numberFormatter';
import { getRewardRate } from '../utils/reward';
import { toCTSI } from '../utils/token';

const Home = () => {
    // user account and blockchain information (from metamask or other wallets)
    const { account, chainId } = useWallet();
    const bg = useColorModeValue('gray.80', 'header');
    const sectionBg = useColorModeValue('white', 'gray.800');

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
            <PageHead
                title="Secure the Cartesi network and earn rewards"
                description="Secure the Cartesi network and earn rewards"
                isHome
            />

            <Box bg={bg}>
                <Box
                    bg="header"
                    color="white"
                    display={{ base: 'block', md: 'flex' }}
                    alignItems="center"
                    justifyContent="space-between"
                    pt={4}
                    pb={8}
                    px={{ base: '6vw', xl: '12vw' }}
                >
                    <Stack alignItems="flex-start" direction="column">
                        <Heading as="h1" fontSize={['4xl', '5xl']}>
                            Explorer
                        </Heading>
                    </Stack>
                    <Wrap
                        color="white"
                        justify={{
                            base: 'flex-start',
                            sm: 'flex-end',
                        }}
                        align="flex-end"
                        pl={{ base: 0, md: '6vw' }}
                        shouldWrapChildren
                    >
                        <CTSIText
                            value={balance}
                            pt={{ base: 4, md: 0 }}
                            pr={{ base: 2, sm: 10, md: 16 }}
                        >
                            <Text color="white" mb={2}>
                                Wallet Balance
                            </Text>
                        </CTSIText>

                        <CTSIText
                            value={stakedBalance.add(poolBalance)}
                            pt={{ base: 4, md: 0 }}
                        >
                            <HStack mb={2}>
                                <Text color="white">Staked Balance</Text>
                                <Tooltip
                                    label="This includes direct staking and pool staking."
                                    placement="top"
                                >
                                    <Icon />
                                </Tooltip>
                            </HStack>
                        </CTSIText>
                    </Wrap>
                </Box>

                <Box
                    bg={sectionBg}
                    w="100%"
                    shadow="md"
                    pb={{ base: 6, md: 12 }}
                    px={{ base: '6vw', xl: '12vw' }}
                >
                    <Flex
                        flexDirection={{ base: 'column', sm: 'row', md: 'row' }}
                        justifyContent={{
                            base: 'flex-start',
                            sm: 'space-between',
                            md: 'space-between',
                        }}
                        alignItems={{
                            base: 'flex-start',
                            sm: 'center',
                            md: 'center',
                        }}
                        flexWrap="wrap"
                        py={{ base: 2, md: 8 }}
                    >
                        <PrimaryCard
                            icon={ChartIcon as FC<IconProps>}
                            mt={4}
                            mb={{ base: 4, md: 0 }}
                            mr={2}
                            minWidth="calc(33.33% - 0.8rem)"
                        >
                            <MarketInfoPanel
                                label={<Text>CTSI Price</Text>}
                                value={marketInformation?.price}
                                unit="USD"
                            />
                        </PrimaryCard>

                        <PrimaryCard
                            icon={MarketCapICon as FC<IconProps>}
                            mt={4}
                            mb={{ base: 4, md: 0 }}
                            mr={2}
                            minWidth="calc(33.33% - 0.8rem)"
                        >
                            <MarketInfoPanel
                                label={
                                    <Flex alignItems="center">
                                        <Text mr={2}>CTSI Market Cap</Text>
                                        <Tooltip
                                            label={
                                                <>
                                                    <Text>
                                                        Market Cap = Current
                                                        Price x Circulating
                                                        Supply
                                                    </Text>
                                                    <br />
                                                    <Text>
                                                        Refers to the total
                                                        market value of a
                                                        cryptocurrency’s
                                                        circulating supply.
                                                    </Text>
                                                </>
                                            }
                                            placement="top"
                                        >
                                            <Icon />
                                        </Tooltip>
                                    </Flex>
                                }
                                value={marketInformation?.marketCap}
                                unit="USD"
                            />
                        </PrimaryCard>

                        <PrimaryCard
                            icon={CircleSupplyIcon as FC<IconProps>}
                            mt={4}
                            minWidth="calc(33.33% - 0.8rem)"
                        >
                            <MarketInfoPanel
                                label={
                                    <Flex alignItems="center">
                                        <Text mr={2}>Circ. Supply</Text>
                                        <Tooltip
                                            label="The number of coins that are currently circulating in the market and are able to be purchased or sold."
                                            placement="top"
                                        >
                                            <Icon />
                                        </Tooltip>
                                    </Flex>
                                }
                                value={marketInformation?.circulatingSupply}
                                unit="CTSI"
                            />
                        </PrimaryCard>
                    </Flex>
                    <Flex
                        flexDirection={{
                            base: 'column',
                            sm: 'column',
                            md: 'row',
                        }}
                        justifyContent={{
                            base: 'flex-start',
                            sm: 'space-between',
                            md: 'space-between',
                        }}
                        alignItems={{
                            base: 'flex-start',
                            sm: 'center',
                            md: 'center',
                        }}
                        flexWrap="wrap"
                    >
                        <Banner
                            Title={
                                <Flex alignItems="center">
                                    <Text mr={2}># Active Nodes</Text>
                                    <Tooltip
                                        label="Nodes registered in the Cartesi Network"
                                        placement="top"
                                    >
                                        <Icon />
                                    </Tooltip>
                                </Flex>
                            }
                            Icon={<ActiveNodeIcon width={7} height={7} />}
                            width={{
                                base: '100%',
                                md: 'calc(50% - 0.8rem)',
                                lg: 'calc(33.33% - 0.8rem)',
                            }}
                            mt={5}
                            alignSelf="stretch"
                        >
                            <Text fontWeight="bold">
                                {formatNumberValue(summary?.totalNodes || 0)}
                            </Text>
                        </Banner>
                        <Banner
                            Title={
                                <Flex alignItems="center">
                                    <Text mr={2}>Total Staked (CTSI)</Text>
                                    <Tooltip
                                        label="Total amount of CTSI locked in the staking contract, currently in the status 'staked'"
                                        placement="top"
                                    >
                                        <Icon />
                                    </Tooltip>
                                </Flex>
                            }
                            Icon={<TotalStakedIcon width={7} height={7} />}
                            width={{
                                base: '100%',
                                md: 'calc(50% - 0.8rem)',
                                lg: 'calc(33.33% - 0.8rem)',
                            }}
                            mt={5}
                            alignSelf="stretch"
                        >
                            <Box
                                fontWeight="bold"
                                display="flex"
                                alignItems="flex-end"
                            >
                                <span>
                                    {formatNumberValue(
                                        toCTSI(
                                            summary?.totalStaked || 0
                                        ).toUnsafeFloat()
                                    )}
                                </span>
                                <Text fontSize={14} ml={3} mb={0.5}>
                                    CTSI
                                </Text>
                            </Box>
                        </Banner>
                        <Banner
                            Title={
                                <Flex alignItems="center">
                                    <Text mr={2}>
                                        Projected Annual Earnings
                                    </Text>
                                    <Tooltip
                                        label="Total annual CTSI distributed in the network divided by the effective total stake."
                                        placement="top"
                                    >
                                        <Icon />
                                    </Tooltip>
                                </Flex>
                            }
                            Icon={<PrizeIcon width={7} height={7} />}
                            width={{
                                base: '100%',
                                md: 'calc(50% - 0.8rem)',
                                lg: 'calc(33.33% - 0.8rem)',
                            }}
                            mt={5}
                            alignSelf="stretch"
                        >
                            <Box
                                fontWeight="bold"
                                display="flex"
                                alignItems="flex-end"
                            >
                                <span>
                                    {formatNumberValue(
                                        yearReturn.toUnsafeFloat(),
                                        1,
                                        'percent'
                                    ).replace('%', '')}
                                </span>
                                <Text fontSize={14} ml={3} mb={0.5}>
                                    %
                                </Text>
                            </Box>
                        </Banner>
                        <Banner
                            Title={
                                <Flex alignItems="center">
                                    <Text mr={2}>Participation Rate</Text>
                                    <Tooltip
                                        label="Total Staked / Circ. Supply"
                                        placement="top"
                                    >
                                        <Icon />
                                    </Tooltip>
                                </Flex>
                            }
                            Icon={<GridIcon width={7} height={7} />}
                            width={{
                                base: '100%',
                                md: 'calc(50% - 0.8rem)',
                                lg: 'calc(33.33% - 0.8rem)',
                            }}
                            mt={5}
                            alignSelf="stretch"
                        >
                            <Box
                                fontWeight="bold"
                                display="flex"
                                alignItems="flex-end"
                            >
                                <span>
                                    {formatNumberValue(
                                        participationRate.toUnsafeFloat(),
                                        1,
                                        'percent'
                                    ).replace('%', '')}
                                </span>
                                <Text fontSize={14} ml={3} mb={0.5}>
                                    %
                                </Text>
                            </Box>
                        </Banner>
                    </Flex>
                </Box>

                <Box
                    bg={sectionBg}
                    w="100%"
                    shadow="md"
                    mt={10}
                    py={{ base: 6, md: 10 }}
                    px={{ base: '6vw', xl: '12vw' }}
                >
                    <Heading as="h1" fontSize={['1xl', '2xl']} mb={4}>
                        Blocks
                    </Heading>

                    <SimpleGrid columns={{ md: 2, '2xl': 4 }} spacing={6}>
                        {blocks.slice(0, 4).map((block) => (
                            <BlockMiniCard
                                chainId={chainId}
                                block={block}
                                key={block.id}
                            />
                        ))}
                    </SimpleGrid>
                </Box>

                <Box
                    bg={sectionBg}
                    w="100%"
                    shadow="md"
                    mt={10}
                    py={{ base: 6, md: 10 }}
                    px={{ base: '6vw', xl: '12vw' }}
                >
                    <HStack justify="space-between" align="center" mb={6}>
                        <Heading as="h1" fontSize={['1xl', '2xl']}>
                            Block Producers
                        </Heading>
                        <SearchInput
                            w={[100, 200, 400, 500]}
                            flex={{ base: 1, md: 'initial' }}
                            onSearchChange={(e) =>
                                setUserSearch(e.target.value)
                            }
                        />
                    </HStack>
                    <Users
                        chainId={chainId}
                        search={userSearch}
                        totalItems={summary?.totalUsers}
                    />
                </Box>
            </Box>
        </Layout>
    );
};

export default Home;
