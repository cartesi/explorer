// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, ReactNode } from 'react';
import {
    Flex,
    FlexProps,
    HStack,
    SystemStyleObject,
    Text,
} from '@chakra-ui/react';
import { formatUnits } from 'viem';
import humanizeDuration from 'humanize-duration';
import { Numeric, toBigInt } from '../utils/bigint';

type Unit = 'eth' | 'ctsi' | 'percent' | 'usd' | 'duration' | 'number';
type Countdown = {
    timeLeft: string;
    timeLabel: string;
};

const formatDuration = (ms: number): string[] => {
    return humanizeDuration(ms, {
        round: true,
        largest: 1,
    }).split(' ');
};

const formatPercentNumber = (
    value: number,
    options?: Intl.NumberFormatOptions,
) => {
    const formatter = new Intl.NumberFormat('en-US', options);
    return formatter.format(value * 100);
};

const formatPercent = (value: Numeric, options?: Intl.NumberFormatOptions) => {
    if (typeof value === 'number') {
        return formatPercentNumber(value, options);
    } else {
        return formatPercentNumber(parseFloat(value.toString()), options);
    }
};

const format = (
    value: Numeric,
    unit: Unit,
    options: Intl.NumberFormatOptions,
): string[] => {
    const numberFormat = new Intl.NumberFormat('en-US', options);
    switch (unit) {
        case 'eth':
            return [
                numberFormat.format(
                    parseFloat(formatUnits(toBigInt(value), 18)),
                ),
                'ETH',
            ];
        case 'ctsi':
            return [
                numberFormat.format(
                    parseFloat(formatUnits(toBigInt(value), 18)),
                ),
                'CTSI',
            ];
        case 'percent':
            return [formatPercent(value, options), '%'];
        case 'usd':
            return [numberFormat.format(parseFloat(value.toString())), 'USD'];
        case 'duration':
            return formatDuration(parseFloat(value.toString()));
        default:
            return [numberFormat.format(Number(toBigInt(value))), ''];
    }
};

export interface BigNumberTextProps extends FlexProps {
    icon?: ReactNode;
    value: Numeric;
    nullLabel?: string;
    direction?: SystemStyleObject['flexDirection'];
    fontSize?: SystemStyleObject['fontSize'];
    unit?: Unit;
    options?: Intl.NumberFormatOptions;
    countdown?: Countdown;
}

const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
};

export const BigNumberText: FC<BigNumberTextProps> = (props) => {
    const {
        children,
        value,
        nullLabel = '-',
        direction = 'column',
        fontSize = '3xl',
        icon = null,
        unit = 'number',
        options = defaultOptions,
        countdown,
        ...flexProps
    } = props;
    const [valueLabel, unitLabel] = value
        ? format(value, unit, options)
        : [nullLabel, ''];

    return (
        <Flex
            direction={direction}
            align="baseline"
            justify="space-between"
            {...flexProps}
        >
            <HStack>
                {icon}
                {children}
            </HStack>
            <HStack align="baseline">
                <>
                    <Text fontSize={fontSize} lineHeight={1}>
                        {valueLabel}
                    </Text>
                    {unit && unitLabel && (
                        <Text
                            fontSize="sm"
                            data-testid="big-number-text-unit-label"
                        >
                            {unitLabel}
                        </Text>
                    )}
                </>
            </HStack>
            {countdown && countdown.timeLeft && (
                <HStack>
                    <Text fontSize="sm">
                        {countdown.timeLabel} {countdown.timeLeft}
                    </Text>
                </HStack>
            )}
        </Flex>
    );
};

const CTSIText: FC<BigNumberTextProps> = (props) => {
    return <BigNumberText unit="ctsi" {...props} />;
};

export default CTSIText;
