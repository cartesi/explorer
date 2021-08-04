// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import { BigNumber, BigNumberish, FixedNumber } from 'ethers';
import { HStack, Icon, StackProps, Text, Tooltip } from '@chakra-ui/react';
import { FaPercentage, FaTrophy, FaUsers } from 'react-icons/fa';
import { FiBox } from 'react-icons/fi';
import StatsPanel from '../home/StatsPanel';
import CTSIText from '../CTSIText';
import BigNumberText from '../BigNumberText';

export interface PoolStatsPanelProps extends StackProps {
    totalUsers: number;
    totalBlocks: number;
    totalReward: BigNumberish;
    totalCommission: BigNumberish;
}

const PoolStatsPanel: FC<PoolStatsPanelProps> = ({
    totalUsers,
    totalReward,
    totalCommission,
    totalBlocks,
    ...stackProps
}) => {
    const commission =
        totalCommission && totalReward && BigNumber.from(totalReward).gt(0)
            ? FixedNumber.from(totalCommission)
                  .divUnsafe(FixedNumber.from(totalReward))
                  .toUnsafeFloat()
            : undefined;
    return (
        <StatsPanel {...stackProps}>
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
            <BigNumberText value={totalBlocks} icon={FiBox}>
                <HStack>
                    <Text>Blocks</Text>
                    <Tooltip
                        label="Total number of blocks produced by this pool"
                        placement="top"
                    >
                        <Icon />
                    </Tooltip>
                </HStack>
            </BigNumberText>
            <CTSIText icon={FaTrophy} value={totalReward}>
                <HStack>
                    <Text>Total Rewards</Text>
                    <Tooltip
                        label="Total amount of tokens collected as reward from block production"
                        placement="top"
                    >
                        <Icon />
                    </Tooltip>
                </HStack>
            </CTSIText>
            <BigNumberText
                icon={FaPercentage}
                value={commission}
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
        </StatsPanel>
    );
};

export default PoolStatsPanel;
