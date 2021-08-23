// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Flex, FlexProps, HStack, SystemProps, Text } from '@chakra-ui/react';
import { BigNumberish } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';

type Unit = 'eth' | 'ctsi' | 'percent' | 'usd';

const unitLabel = (unit: Unit) => {
    switch (unit) {
        case 'eth':
            return 'ETH';
        case 'ctsi':
            return 'CTSI';
        case 'percent':
            return '%';
        case 'usd':
            return 'USD';
        default:
            return '';
    }
};

const formatPercentNumber = (
    value: number,
    options?: Intl.NumberFormatOptions
) => {
    const formatter = new Intl.NumberFormat('en-US', options);
    return formatter.format(value * 100);
};

const formatPercent = (
    value: BigNumberish,
    options?: Intl.NumberFormatOptions
) => {
    if (typeof value === 'number') {
        return formatPercentNumber(value, options);
    } else {
        return formatPercentNumber(parseFloat(value.toString()), options);
    }
};

export interface BigNumberTextProps extends FlexProps {
    icon?: IconType;
    value: BigNumberish;
    nullLabel?: string;
    direction?: SystemProps['flexDirection'];
    unit?: Unit;
    options?: Intl.NumberFormatOptions;
}

const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
};

const BigNumberText: FC<BigNumberTextProps> = (props) => {
    const {
        children,
        value,
        nullLabel = '-',
        direction = 'column',
        icon,
        unit,
        options = defaultOptions,
        ...flexProps
    } = props;
    const numberFormat = new Intl.NumberFormat('en-US', options);
    const valueLabel = !value
        ? nullLabel
        : unit == 'eth'
        ? numberFormat.format(parseFloat(formatUnits(value, 18)))
        : unit == 'ctsi'
        ? numberFormat.format(parseFloat(formatUnits(value, 18)))
        : unit == 'percent'
        ? formatPercent(value, options)
        : numberFormat.format(parseFloat(value.toString()));

    return (
        <Flex
            direction={direction}
            align="baseline"
            justify="space-between"
            {...flexProps}
        >
            <HStack>
                {icon && <Icon as={icon} color={props.color} />}
                {children}
            </HStack>
            <HStack align="baseline">
                <Text fontSize="xx-large">{valueLabel}</Text>
                {unit && value && (
                    <Text fontSize="small">{unitLabel(unit)}</Text>
                )}
            </HStack>
        </Flex>
    );
};

export default BigNumberText;
