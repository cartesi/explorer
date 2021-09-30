// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import { HStack, Icon, StackProps, Text, Tooltip } from '@chakra-ui/react';
import { FaCoins, FaUsers } from 'react-icons/fa';
import { GiPieChart } from 'react-icons/gi';
import { FiBox } from 'react-icons/fi';
import StatsPanel from '../home/StatsPanel';
import CTSIText from '../CTSIText';
import BigNumberText from '../BigNumberText';
import { StakingPoolFee } from '../../graphql/models';
import CommissionText from '../CommissionText';

export interface PoolStatsPanelProps extends StackProps {
    stakedBalance: BigNumber;
    totalBlocks: number;
    totalUsers: number;
    productionInterval: number; // average number of milliseconds between blocks considering the last 10 produced blocks
    totalReward: BigNumberish;
    commissionPercentage: number;
    fee: StakingPoolFee;
}

const PoolStatsPanel: FC<PoolStatsPanelProps> = (props) => {
    const {
        commissionPercentage,
        stakedBalance,
        totalBlocks,
        totalUsers,
        productionInterval,
        fee,
        ...stackProps
    } = props;

    return (
        <StatsPanel {...stackProps}>
            <CTSIText
                icon={FaCoins}
                value={stakedBalance}
                options={{
                    notation: 'compact',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                }}
            >
                <HStack>
                    <Text>Staked Balance</Text>
                    <Tooltip
                        label="Total amount of tokens staked in this pool"
                        placement="top"
                    >
                        <Icon />
                    </Tooltip>
                </HStack>
            </CTSIText>
            <BigNumberText value={totalUsers} icon={FaUsers}>
                <HStack>
                    <Text>Users</Text>
                    <Tooltip
                        label="Number of users who staked in this pool"
                        placement="top"
                    >
                        <Icon />
                    </Tooltip>
                </HStack>
            </BigNumberText>
            <BigNumberText
                value={productionInterval}
                icon={FiBox}
                unit="duration"
            >
                <HStack>
                    <Text>Production Interval</Text>
                    <Tooltip
                        label={`Average interval between the last ${Math.min(
                            10,
                            totalBlocks
                        )} blocks produced by the pool`}
                        placement="top"
                    >
                        <Icon />
                    </Tooltip>
                </HStack>
            </BigNumberText>
            {commissionPercentage && (
                <BigNumberText
                    icon={GiPieChart}
                    value={commissionPercentage}
                    unit="percent"
                >
                    <HStack>
                        <Text>Commission</Text>
                        <Tooltip
                            label="Effective commission taken by pool manager"
                            placement="top"
                        >
                            <Icon />
                        </Tooltip>
                    </HStack>
                </BigNumberText>
            )}
            {!commissionPercentage && (
                <CommissionText icon={GiPieChart} value={fee}>
                    <Text>Commission</Text>
                    <Tooltip
                        label="Configured commission taken by pool manager"
                        placement="top"
                    >
                        <Icon />
                    </Tooltip>
                </CommissionText>
            )}
        </StatsPanel>
    );
};

export default PoolStatsPanel;
