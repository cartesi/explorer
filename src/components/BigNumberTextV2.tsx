// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Heading, Box, FlexProps, HStack, Text } from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import humanizeDuration from 'humanize-duration';

type Unit = 'eth' | 'ctsi' | 'percent' | 'usd' | 'duration';
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

const format = (
    value: BigNumberish,
    unit: Unit,
    options: Intl.NumberFormatOptions
): string[] => {
    const numberFormat = new Intl.NumberFormat('en-US', options);
    switch (unit) {
        case 'eth':
            return [
                numberFormat.format(parseFloat(formatUnits(value, 18))),
                'ETH',
            ];
        case 'ctsi':
            return [
                numberFormat.format(parseFloat(formatUnits(value, 18))),
                'CTSI',
            ];
        case 'percent':
            return [formatPercent(value, options), '%'];
        case 'usd':
            return [numberFormat.format(parseFloat(value.toString())), 'USD'];
        case 'duration':
            return formatDuration(parseFloat(value.toString()));
        default:
            return [numberFormat.format(BigNumber.from(value).toNumber()), ''];
    }
};

export interface BigNumberTextV2Props extends FlexProps {
    icon?: IconType;
    value: BigNumberish;
    nullLabel?: string;
    unit?: Unit;
    options?: Intl.NumberFormatOptions;
    countdown?: Countdown;
    componentStyle?: string;
    note?: string;
}

const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
};

const BigNumberTextV2: FC<BigNumberTextV2Props> = (props) => {
    const {
        children,
        value,
        nullLabel = '-',
        icon,
        unit,
        options = defaultOptions,
        countdown,
        componentStyle = 'default',
        note,
        ...flexProps
    } = props;
    const [valueLabel, unitLabel] = value
        ? format(value, unit, options)
        : [nullLabel, ''];

    const styles = {
        default: {
            as: 'h2',
            size: 'lg',
            fontWeight: 'bold',
            px: '0',
            py: '0',
            flexGrow: '0',
        },
        popover: {
            as: 'h3',
            size: 'md',
            px: '4',
            py: '2',
            flexGrow: '0',
        },
        ctaChevron: {
            as: 'h2',
            size: 'lg',
            fontWeight: 'bold',
            px: '0',
            py: '0',
            flexGrow: '1',
        },
    };

    return (
        <Box
            px={styles[componentStyle].px}
            py={styles[componentStyle].py}
            flexGrow={styles[componentStyle].flexGrow}
            {...flexProps}
        >
            {icon && <Icon as={icon} color={props.color} />}
            {children}
            <HStack align="baseline">
                <Heading
                    as={styles[componentStyle].as}
                    m={0}
                    size={styles[componentStyle].size}
                    fontWeight={styles[componentStyle].fontWeight}
                >
                    {valueLabel}
                </Heading>
                {unit && value && (
                    <>
                        <Text size={'base'}>{unitLabel}</Text>
                        {note && (
                            <Text size={'base'} paddingLeft={4}>
                                {note}
                            </Text>
                        )}
                    </>
                )}
            </HStack>
            {countdown && countdown.timeLeft && (
                <Text fontSize="sm" color="orange.500">
                    {countdown.timeLabel} {countdown.timeLeft}
                </Text>
            )}
        </Box>
    );
};

export default BigNumberTextV2;
