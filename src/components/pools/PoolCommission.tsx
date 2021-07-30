// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Flex, HStack, SystemProps, Text, TextProps } from '@chakra-ui/react';
import { ethers, FixedNumber } from 'ethers';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import { StakingPool } from '../../graphql/models';
import { useStakingPoolCommission } from '../../services/pool';
import labels from '../../utils/labels';

export interface PoolCommissionProps extends TextProps {
    pool: StakingPool;
    label: string;
    icon?: IconType;
    direction?: SystemProps['flexDirection'];
}

const PoolCommission: FC<PoolCommissionProps> = (props) => {
    const { pool, direction = 'column', icon, label, ...textProps } = props;

    // commission simulation
    // XXX: 2900 should not be here
    const reward = ethers.utils.parseUnits('2900', 18);
    const nextCommission = useStakingPoolCommission(pool.id, reward);

    // calculate historical commission
    const totalReward = FixedNumber.from(pool.user.totalReward);
    const totalCommission = FixedNumber.from(pool.totalCommission);
    const accuredCommissionLabel = totalReward.isZero()
        ? ''
        : `${totalCommission
              .divUnsafe(totalReward)
              .mulUnsafe(FixedNumber.from(100))
              .toUnsafeFloat()
              .toFixed(2)} %`;

    // commission label
    let commissionLabel = '';
    if (pool.fee.commission) {
        commissionLabel = `${(pool.fee.commission / 100).toFixed(2)} %`;
    } else if (pool.fee.gas) {
        commissionLabel = `${pool.fee.gas} Gas`;
    }

    // calculate commission for next block, by calling the fee contract
    const nextCommissionLabel = nextCommission.value
        ? `(${(nextCommission.value * 100).toFixed(2)} %)`
        : '';

    // commission help tooptip
    let commissionTooltip: string = undefined;
    if (pool.fee.commission) {
        commissionTooltip = labels.flatRateCommission;
    } else if (pool.fee.gas) {
        commissionTooltip = labels.gasTaxCommission;
    }

    const valueLabel = `${accuredCommissionLabel} (${commissionLabel})`;
    return (
        <Flex direction={direction} align="baseline" justify="space-between">
            <HStack>
                {icon && <Icon as={icon} color={props.color} />}
                <Text {...textProps}>{label}</Text>
            </HStack>
            <HStack align="baseline">
                <Text fontSize="xx-large" {...textProps}>
                    {valueLabel}
                </Text>
                <Text fontSize="small" {...textProps}>
                    CTSI
                </Text>
            </HStack>
        </Flex>
    );
};

export default PoolCommission;
