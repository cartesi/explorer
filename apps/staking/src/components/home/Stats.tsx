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
    IconProps,
    Text,
    Tooltip,
    useColorModeValue,
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
import { FixedNumber } from 'ethers';
import { FC } from 'react';
import MarketInfoPanel from '../../components/home/MarketInfoPanel';
import PrimaryCard from '../../components/home/PrimaryCard';
import useBlocks from '../../graphql/hooks/useBlocks';
import useSummary from '../../graphql/hooks/useSummary';
import { useMarketInformation } from '../../services/market';
import { formatNumberValue } from '../../utils/numberFormatter';
import { getRewardRate } from '../../utils/reward';
import { toCTSI } from '../../utils/token';

const HomeStats = () => {
    const sectionBg = useColorModeValue('white', 'dark.gray.primary');
    const summary = useSummary();
    const { marketInformation } = useMarketInformation();
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

    const bannerIconColor = useColorModeValue('black', 'dark.primary');

    return (
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
                            <Flex>
                                <Text mr={2}>CTSI Market Cap</Text>
                                <Tooltip
                                    label={
                                        <>
                                            <Text>
                                                Market Cap = Current Price x
                                                Circulating Supply
                                            </Text>
                                            <br />
                                            <Text>
                                                Refers to the total market value
                                                of a cryptocurrency’s
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
                            <Flex>
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
                    Icon={
                        <ActiveNodeIcon
                            color={bannerIconColor}
                            width={7}
                            height={7}
                        />
                    }
                    width={{
                        base: '100%',
                        md: 'calc(50% - 0.8rem)',
                        lg: 'calc(33.33% - 0.8rem)',
                    }}
                    mt={5}
                    alignSelf="stretch"
                >
                    <Text fontWeight={500}>
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
                    Icon={
                        <TotalStakedIcon
                            color={bannerIconColor}
                            width={7}
                            height={7}
                        />
                    }
                    width={{
                        base: '100%',
                        md: 'calc(50% - 0.8rem)',
                        lg: 'calc(33.33% - 0.8rem)',
                    }}
                    mt={5}
                    alignSelf="stretch"
                >
                    <Box fontWeight={500} display="flex" alignItems="flex-end">
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
                            <Text mr={2}>Projected Annual Earnings</Text>
                            <Tooltip
                                label="Total annual CTSI distributed in the network divided by the effective total stake."
                                placement="top"
                            >
                                <Icon />
                            </Tooltip>
                        </Flex>
                    }
                    Icon={
                        <PrizeIcon
                            color={bannerIconColor}
                            width={7}
                            height={7}
                        />
                    }
                    width={{
                        base: '100%',
                        md: 'calc(50% - 0.8rem)',
                        lg: 'calc(33.33% - 0.8rem)',
                    }}
                    mt={5}
                    alignSelf="stretch"
                >
                    <Box fontWeight={500} display="flex" alignItems="flex-end">
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
                    Icon={
                        <GridIcon
                            color={bannerIconColor}
                            width={7}
                            height={7}
                        />
                    }
                    width={{
                        base: '100%',
                        md: 'calc(50% - 0.8rem)',
                        lg: 'calc(33.33% - 0.8rem)',
                    }}
                    mt={5}
                    alignSelf="stretch"
                >
                    <Box fontWeight={500} display="flex" alignItems="flex-end">
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
    );
};

export default HomeStats;
