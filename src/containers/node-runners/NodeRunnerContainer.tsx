// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import {
    Box,
    Stack,
    Heading,
    Text,
    useColorModeValue,
    BoxProps,
} from '@chakra-ui/react';
import { NextRouter } from 'next/router';
import { useEffect } from 'react';
import { UseWallet } from '../../contexts/wallet';
import PoolTable from './components/PoolTable';
import NodeTable from './components/NodeTable';
import useStakingPools from '../../graphql/hooks/useStakingPools';
import { StakingPool, StakingPoolsData } from '../../graphql/models';
import { formatCTSI } from '../../utils/token';
import { formatValue } from '../../utils/numberFormatter';
import { PoolInfo } from './interfaces';
import { useAtom } from 'jotai';
import {
    poolDataFetchingAtom,
    poolInfoListAtom,
    poolSortByAtom,
} from './atoms';
import CreationPath from './components/CreationPath';
import AlertAndConnect from './components/AlertAndConnect';
import Block from './components/Block';

export interface NodeRunnersContainerProps {
    wallet: UseWallet;
    router: NextRouter;
}

interface TableInfo {
    boxProps?: BoxProps;
}

const NodeTableInfo = ({ boxProps }: TableInfo) => {
    const bg = useColorModeValue('white', 'gray.800');

    return (
        <Block bg={bg} {...boxProps}>
            <Stack justify="space-between" direction={'row'}>
                <Heading
                    fontSize="2xl"
                    mt={5}
                    mb={{ base: 4, md: 8 }}
                    fontWeight="medium"
                    lineHeight={6}
                >
                    Private Node Management
                </Heading>
            </Stack>
            <NodeTable />
        </Block>
    );
};

const Header = () => (
    <Box bg="header" color="white" px={{ base: '6vw', xl: '12vw' }} py={5}>
        <Stack alignItems={'flex-start'} direction={'column'}>
            <Heading as="h1" fontSize={['4xl', '5xl']}>
                Node Runners
            </Heading>
            <Text fontSize="md" fontWeight="400">
                This area is for the node runner users including public pool
                manager or private node runner.{' '}
            </Text>
        </Stack>
    </Box>
);

const normalise = (data: StakingPoolsData) => {
    if (!data?.stakingPools) return null;
    return data.stakingPools.map((pool: StakingPool) => {
        return {
            id: pool.id,
            totalStaked: formatCTSI(pool.amount, 2),
            totalUsers: pool.totalUsers,
            totalRewards: formatCTSI(pool.user?.totalReward, 2),
            commission: pool.commissionPercentage
                ? formatValue(pool.commissionPercentage, 'percent', {
                      maximumFractionDigits: 2,
                  })
                : '-',
            blocksProduced: pool.user.totalBlocks,
        } as PoolInfo;
    });
};

export const NodeRunnersContainer = ({
    wallet,
    router,
}: NodeRunnersContainerProps) => {
    const bg = useColorModeValue('gray.80', 'header');
    const [poolSortBy] = useAtom(poolSortByAtom);
    const [, setPoolDataLoading] = useAtom(poolDataFetchingAtom);
    const [, setPoolInfoList] = useAtom(poolInfoListAtom);
    const { activate, active, account } = wallet;
    const { loading, data } = useStakingPools({
        where: { manager: account },
        sort: poolSortBy,
    });

    useEffect(() => setPoolDataLoading(loading), [loading]);
    useEffect(() => {
        const list = normalise(data);
        if (!list && loading) return;
        setPoolInfoList(list);
    }, [data]);

    return (
        <>
            <Header />
            <AlertAndConnect isVisible={!active} onConnect={activate} />
            {active && <PoolTable />}
            {active && <Block bg={bg} pt={0} pb={7} />}
            {active && <NodeTableInfo />}
            <CreationPath router={router} />
        </>
    );
};
