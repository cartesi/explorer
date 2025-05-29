// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Flex,
    FlexProps,
    HStack,
    Icon,
    SystemStyleObject,
    Text,
} from '@chakra-ui/react';
import { FC } from 'react';
import { IconType } from 'react-icons';
import { StakingPool } from '../../graphql/models';

export interface PoolCommissionProps extends FlexProps {
    pool: StakingPool;
    label: string;
    icon?: IconType;
    direction?: SystemStyleObject['flexDirection'];
}

const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
});

const PoolCommission: FC<PoolCommissionProps> = (props) => {
    const { pool, direction = 'column', icon, label, ...textProps } = props;
    const accruedCommissionLabel =
        pool.commissionPercentage !== null
            ? numberFormat.format(pool.commissionPercentage)
            : '-';
    const commissionLabel = `${(pool.fee.commission / 100).toFixed(2)} %`;

    const valueLabel = `${accruedCommissionLabel} (${commissionLabel})`;
    return (
        <Flex direction={direction} align="baseline" justify="space-between">
            <HStack>
                {icon && (
                    <Icon
                        data-testid="pool-commission-icon"
                        as={icon}
                        color={props.color}
                    />
                )}
                <Text {...textProps}>{label}</Text>
            </HStack>
            <HStack align="baseline">
                <Text fontSize="3xl" {...textProps}>
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
