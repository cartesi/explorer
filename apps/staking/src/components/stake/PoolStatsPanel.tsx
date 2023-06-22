// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { SimpleGrid, StackProps } from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';
import { FC } from 'react';
import { StakingPoolFee } from '../../graphql/models';
import CommissionStat from './stats/CommissionStat';
import EffectiveBalanceStat from './stats/EffectiveBalanceStat';
import PoolBalanceStat from './stats/PoolBalanceStat';
import PoolPerformanceStat from './stats/PoolPerformanceStat';
import ProductionIntervalStat from './stats/ProductionIntervalStat';
import StakedBalanceStat from './stats/StakedBalanceStat';
import UsersStat from './stats/UsersStat';

export interface PoolStatsPanelProps extends StackProps {
    address: string;
    stakedBalance: BigNumber;
    totalBlocks: number;
    totalUsers: number;
    productionInterval: number; // average number of milliseconds between blocks considering the last 10 produced blocks
    totalReward: BigNumberish;
    commissionPercentage: number;
    fee: StakingPoolFee;
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
        onRebalance,
    } = props;

    return (
        <>
            <SimpleGrid
                columns={{
                    base: 1,
                    lg: 3,
                }}
                w="full"
                spacing={4}
                role="balance-stat"
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
                spacing={5}
                role="commission-stat"
            >
                <UsersStat
                    location={`/stake/${address}/users`}
                    totalUsers={totalUsers}
                />
                <ProductionIntervalStat
                    productionInterval={productionInterval}
                    totalBlocks={totalBlocks}
                />
                <CommissionStat
                    location={`/stake/${address}/commissions`}
                    commissionPercentage={commissionPercentage}
                    fee={fee}
                />

                <PoolPerformanceStat address={address} />
            </SimpleGrid>
        </>
    );
};

export default PoolStatsPanel;
