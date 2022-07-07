// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import { StackProps, SimpleGrid } from '@chakra-ui/react';
import { useFlag } from '@unleash/proxy-client-react';
import { StakingPoolFee } from '../../graphql/models';
import StakedBalanceStat from './stats/StakedBalanceStat';
import EffectiveBalanceStat from './stats/EffectiveBalanceStat';
import PoolBalanceStat from './stats/PoolBalanceStat';
import UsersStat from './stats/UsersStat';
import ProductionIntervalStat from './stats/ProductionIntervalStat';
import CommissionStat from './stats/CommissionStat';
import PoolPerformanceStat from './stats/PoolPerformanceStat';

export interface PoolStatsPanelProps extends StackProps {
    address: string;
    stakedBalance: BigNumber;
    totalBlocks: number;
    totalUsers: number;
    productionInterval: number; // average number of milliseconds between blocks considering the last 10 produced blocks
    totalReward: BigNumberish;
    commissionPercentage: number;
    fee: StakingPoolFee;
    amount: BigNumber;
    pool: BigNumber;
    stake: BigNumber;
    unstake: BigNumber;
    withdraw: BigNumber;
    stakingMature: BigNumber;
    stakingMaturing: BigNumber;
    stakingReleasing: BigNumber;
    stakingReleased: BigNumber;
    stakingMaturingTimestamp: Date;
    stakingReleasingTimestamp: Date;
    hideZeros: boolean;
    onRebalance?: () => void;
}

const PoolStatsPanel: FC<PoolStatsPanelProps> = (props) => {
    const {
        address,
        commissionPercentage,
        stakedBalance,
        totalBlocks,
        totalUsers,
        productionInterval,
        fee,
        amount,
        pool,
        stake,
        unstake,
        withdraw,
        stakingMature,
        stakingMaturing,
        stakingReleasing,
        stakingReleased,
        stakingMaturingTimestamp,
        stakingReleasingTimestamp,
        hideZeros = true,
        onRebalance,
        ...stackProps
    } = props;

    const aws = useFlag('aws');
    const apr = useFlag('apr');
    const performanceStatsEnabled = aws && apr;

    return (
        <>
            <SimpleGrid
                columns={{
                    base: 1,
                    lg: 3,
                }}
                w="full"
                spacing={4}
            >
                <StakedBalanceStat stakedBalance={stakedBalance} />
                <EffectiveBalanceStat
                    stake={stake}
                    unstake={unstake}
                    withdraw={withdraw}
                    stakingMature={stakingMature}
                    stakingMaturing={stakingMaturing}
                    stakingReleasing={stakingReleasing}
                    stakingReleased={stakingReleased}
                    stakingMaturingTimestamp={stakingMaturingTimestamp}
                    stakingReleasingTimestamp={stakingReleasingTimestamp}
                    onRebalance={onRebalance}
                />
                <PoolBalanceStat pool={pool} />
            </SimpleGrid>

            <SimpleGrid
                columns={{
                    base: 1,
                    lg: 3,
                }}
                w="full"
                spacing={4}
            >
                <UsersStat totalUsers={totalUsers} />
                <ProductionIntervalStat
                    productionInterval={productionInterval}
                    totalBlocks={totalBlocks}
                />
                <CommissionStat
                    commissionPercentage={commissionPercentage}
                    fee={fee}
                />
                {performanceStatsEnabled && (
                    <PoolPerformanceStat address={address} />
                )}
            </SimpleGrid>
        </>
    );
};

export default PoolStatsPanel;
