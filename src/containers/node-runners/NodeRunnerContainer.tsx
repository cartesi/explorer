// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.
import { Box, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { NextRouter } from 'next/router';
import { useEffect } from 'react';
import { UseWallet } from '../../components/wallet';
import { useUserNodes } from '../../graphql/hooks/useNodes';
import useStakingPools from '../../graphql/hooks/useStakingPools';
import { Node, StakingPool } from '../../graphql/models';
import { formatValue } from '../../utils/numberFormatter';
import { formatCTSI } from '../../utils/token';
import {
    nodeInfoFetchingAtom,
    nodeInfoListAtom,
    poolDataFetchingAtom,
    poolInfoListAtom,
    poolSortByAtom,
} from './atoms';
import AlertAndConnect from './components/AlertAndConnect';
import Block from './components/Block';
import CreationPath from './components/CreationPath';
import NodeTable from './components/NodeTable';
import PoolTable from './components/PoolTable';
import { NodeInfo, PoolInfo } from './interfaces';

export interface NodeRunnersContainerProps {
    wallet: UseWallet;
    router: NextRouter;
}

const Header = () => (
    <Box
        bg="dark.gray.tertiary"
        color="white"
        px={{ base: '6vw', xl: '12vw' }}
        py={5}
    >
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

const nodeMapper = (node: Node) => {
    return {
        id: node.id,
        totalStaked: formatCTSI(node.owner?.balance, 2),
        totalRewards: formatCTSI(node.totalReward, 2),
        blocksProduced: node.totalBlocks,
        nodeStatus: 'Hired',
    } as NodeInfo;
};

const poolMapper = (pool: StakingPool) => {
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
};

const normalise = <T, R>(list: T[] | null, mapper: (item: T) => R) => {
    if (!list) return null;
    return list.map(mapper);
};

export const NodeRunnersContainer = ({
    wallet,
    router,
}: NodeRunnersContainerProps) => {
    const bgBlock = useColorModeValue(
        'light.gray.secondary',
        'dark.gray.tertiary'
    );
    const [poolSortBy] = useAtom(poolSortByAtom);
    const [, setPoolDataLoading] = useAtom(poolDataFetchingAtom);
    const [, setPoolInfoList] = useAtom(poolInfoListAtom);
    const [, setIsLoadingNodes] = useAtom(nodeInfoFetchingAtom);
    const [, setNodeInfoList] = useAtom(nodeInfoListAtom);
    const { activate, active, account } = wallet;
    const stakingPools = useStakingPools({
        where: { manager: account || '0' },
        sort: poolSortBy,
    });
    const userNodes = useUserNodes(account, 1, {
        where: { status_not: 'Retired' },
    });

    useEffect(() => setIsLoadingNodes(userNodes.loading), [userNodes.loading]);
    useEffect(
        () => setPoolDataLoading(stakingPools.loading),
        [stakingPools.loading]
    );

    useEffect(() => {
        // the null value case is ignored since in case the list is empty
        // the table is not rendered
        const list = normalise(stakingPools.data?.stakingPools, poolMapper);
        if (!list && stakingPools.loading) return;
        setPoolInfoList(list);
    }, [stakingPools.data]);

    useEffect(() => {
        const list = normalise(userNodes.data?.nodes, nodeMapper);
        if (!list && userNodes.loading) return;
        setNodeInfoList(list);
    }, [userNodes.data]);

    return (
        <>
            <Header />
            <AlertAndConnect isVisible={!active} onConnect={activate} />
            {active && <PoolTable />}
            {active && <Block bg={bgBlock} pt={0} pb={7} />}
            {active && <NodeTable />}
            <CreationPath router={router} />
        </>
    );
};
