// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { constants } from 'ethers';
import { PoolHeader } from '../../components/stake/PoolHeader';
import { PoolBreadcrumbs } from '../../components/stake/PoolBreadcrumbs';

import {
    Collapse,
    useDisclosure,
    VStack,
    useColorModeValue,
    HStack,
    Heading,
    Box,
} from '@chakra-ui/react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { QueryResult } from '@apollo/client';
import { useBlockNumber } from '../../services/eth';
import { useCartesiToken } from '../../services/token';
import { useStaking } from '../../services/staking';
import { useStakingPool } from '../../services/pool';
import { useWallet } from '@explorer/wallet';
import useStakingPoolQuery from '../../graphql/hooks/useStakingPool';
import PoolStatsPanel from '../../components/stake/PoolStatsPanel';
import { PoolActivity } from '../../components/stake/PoolActivity';
import useBlocks from '../../graphql/hooks/useBlocks';
import { BlocksData, BlocksVars } from '../../graphql/models';
import PageHead from '../../components/PageHead';
import {
    Context,
    ENSStaticProps,
    getENSStaticProps,
    getPoolsStaticPaths,
} from '../../utils/staticGeneration';

export async function getStaticPaths() {
    return getPoolsStaticPaths();
}

export async function getStaticProps(context: Context) {
    return getENSStaticProps(context);
}

const blockAverageInterval = (
    result: QueryResult<BlocksData, BlocksVars>
): number => {
    const count = result.data?.blocks?.length;
    if (count > 0) {
        const last = result.data.blocks[count - 1];
        const now = Date.now();
        return (now - last.timestamp * 1000) / count;
    }
    return 0;
};

const PoolInfo = ({ formattedAddress }: ENSStaticProps) => {
    const { account } = useWallet();

    // get pool address from path
    const router = useRouter();
    const address = router.query.pool as string;

    // query block number (continuously)
    const blockNumber = useBlockNumber();

    // query pool data
    const { amount, amounts, rebalance } = useStakingPool(address, account);

    // query pool contract ERC20 balance
    const { balance: poolBalance } = useCartesiToken(
        address,
        null,
        blockNumber
    );

    // query staking contract with pool address
    const staking = useStaking(address);

    // query thegraph pool data
    const stakingPool = useStakingPoolQuery(address);

    // query 10 latest blocks for average interval
    const productionInterval = blockAverageInterval(
        useBlocks({ producer: address }, 10)
    );

    const titleLeftBorder = useColorModeValue('gray.900', 'white');

    const { isOpen, onToggle } = useDisclosure({
        defaultIsOpen: true,
    });

    const isManager = account && account.toLowerCase() === stakingPool?.manager;
    const bg = useColorModeValue('white', 'dark.gray.primary');

    return (
        <Layout>
            <PageHead
                title={`Cartesi pool info - ${formattedAddress}`}
                description={`Cartesi pool info - ${formattedAddress}`}
            />
            <PoolHeader isManager={isManager} />
            <PoolBreadcrumbs currentPage="Overview" />
            <Box
                px={{ base: '6vw', xl: '12vw' }}
                py={{ base: 4, sm: 8, lg: 26 }}
                backgroundColor={bg}
            >
                <HStack
                    spacing={4}
                    align="center"
                    justify="space-between"
                    mb={2}
                    display={{
                        base: 'flex',
                        lg: 'none',
                    }}
                    cursor="pointer"
                    onClick={onToggle}
                >
                    <Heading
                        size="lg"
                        borderLeftWidth={2}
                        borderLeftColor={titleLeftBorder}
                        pl={4}
                    >
                        Overview
                    </Heading>

                    <Box transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}>
                        <ChevronDownIcon w={6} h={6} />
                    </Box>
                </HStack>

                <Collapse in={isOpen}>
                    <VStack spacing={5}>
                        <PoolStatsPanel
                            address={address}
                            productionInterval={productionInterval}
                            stakedBalance={amount}
                            totalBlocks={stakingPool?.user?.totalBlocks}
                            totalReward={stakingPool?.user?.totalReward}
                            totalUsers={stakingPool?.totalUsers}
                            commissionPercentage={
                                stakingPool?.commissionPercentage
                            }
                            fee={stakingPool?.fee}
                            pool={poolBalance}
                            stake={amounts?.stake}
                            unstake={amounts?.unstake}
                            withdraw={amounts?.withdraw}
                            stakingMature={staking?.stakedBalance}
                            stakingMaturing={staking?.maturingBalance}
                            stakingReleasing={
                                staking?.releasingTimestamp?.getTime() >
                                Date.now()
                                    ? staking.releasingBalance
                                    : constants.Zero
                            }
                            stakingReleased={
                                staking?.releasingTimestamp?.getTime() <=
                                Date.now()
                                    ? staking.releasingBalance
                                    : constants.Zero
                            }
                            stakingMaturingTimestamp={
                                staking?.maturingTimestamp
                            }
                            stakingReleasingTimestamp={
                                staking?.releasingTimestamp
                            }
                            onRebalance={rebalance}
                        />
                    </VStack>
                </Collapse>
            </Box>
            <Box
                px={{ base: '6vw', xl: '12vw' }}
                py={{ base: 8, sm: 12, lg: 16 }}
                backgroundColor={bg}
            >
                <Heading as="h2" size="lg" mb={4}>
                    Pool Activity
                </Heading>

                <PoolActivity poolAddress={address} />
            </Box>
        </Layout>
    );
};

export default PoolInfo;
