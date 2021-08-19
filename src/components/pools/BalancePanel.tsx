// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import { BigNumber, constants } from 'ethers';
import {
    HStack,
    Icon,
    Link,
    StackProps,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import { FaBalanceScaleLeft, FaBolt, FaCoins, FaUsers } from 'react-icons/fa';
import { BsClockHistory } from 'react-icons/bs';
import StatsPanel from '../home/StatsPanel';
import CTSIText from '../CTSIText';
import { formatCTSI } from '../../utils/token';

export interface BalancePanelProps extends StackProps {
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

const BalancePanel: FC<BalancePanelProps> = ({
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
}) => {
    // tells if an action needs to be done to move tokens around
    const needRebalance =
        stake?.gt(constants.Zero) ||
        unstake?.gt(constants.Zero) ||
        withdraw?.gt(constants.Zero);

    let rebalanceLabel = 'click to rebalance.';
    if (stake?.gt(constants.Zero)) {
        rebalanceLabel =
            `${formatCTSI(stake)} CTSI to stake, ` + rebalanceLabel;
    } else if (unstake?.gt(constants.Zero)) {
        rebalanceLabel =
            `${formatCTSI(unstake)} CTSI to unstake, ` + rebalanceLabel;
    } else if (withdraw?.gt(constants.Zero)) {
        rebalanceLabel =
            `${formatCTSI(withdraw)} CTSI to withdraw, ` + rebalanceLabel;
    }

    return (
        <StatsPanel {...stackProps}>
            <CTSIText value={amount} icon={FaCoins}>
                <HStack>
                    <Text>Staked Balance</Text>
                    <Tooltip
                        label="Amount of tokens staked by users to the pool"
                        placement="top"
                    >
                        <Icon />
                    </Tooltip>
                </HStack>
            </CTSIText>
            <CTSIText
                value={stakingMature}
                icon={FaBolt}
                color={needRebalance ? 'red' : undefined}
            >
                <HStack>
                    <Text color={needRebalance ? 'red' : undefined}>
                        Effective Balance
                    </Text>
                    <Tooltip
                        label="Amount of mature pool tokens at the Staking contract"
                        placement="top"
                    >
                        <Icon />
                    </Tooltip>
                    {needRebalance && (
                        <Tooltip label={rebalanceLabel} placement="top">
                            <Link onClick={onRebalance}>
                                <FaBalanceScaleLeft />
                            </Link>
                        </Tooltip>
                    )}
                </HStack>
            </CTSIText>
            {[
                {
                    value: stakingMaturing,
                    label: 'Maturing Balance',
                    icon: BsClockHistory,
                    help: 'Amount of pool tokens maturing at the Staking contract',
                },
                {
                    value: stakingReleasing,
                    label: 'Releasing Balance',
                    icon: BsClockHistory,
                    help: 'Amount of pool tokens being unstaken at the Staking contract',
                },
                {
                    value: stakingReleased,
                    label: 'Released Balance',
                    icon: FaCoins,
                    help: 'Amount of pool tokens available for withdraw at the Staking contract',
                },
                {
                    value: pool,
                    label: 'Pool Balance',
                    icon: FaUsers,
                    help: 'Amount of tokens available at the pool contract either for stake or withdraw',
                },
            ].map(
                ({ value, label, icon, help }) =>
                    !(value?.isZero() && hideZeros) && (
                        <CTSIText value={value} icon={icon} key={label}>
                            <HStack>
                                <Text>{label}</Text>
                                <Tooltip label={help} placement="top">
                                    <Icon />
                                </Tooltip>
                            </HStack>
                        </CTSIText>
                    )
            )}
        </StatsPanel>
    );
};

export default BalancePanel;
