// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import { HStack, Text, TextProps, Tooltip, VStack } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';

export type StatsUnit = 'decimal' | 'percent';

export interface StatsProps extends TextProps {
    label: string;
    value?: number;
    unit?: StatsUnit;
    fractionDigits?: number;
    help?: string;
}

const Stats: FunctionComponent<StatsProps> = (props) => {
    const { fractionDigits = 4, label, value, unit = 'decimal', help } = props;

    const numberFormat = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: fractionDigits,
        notation: 'compact',
        style: unit,
    });
    const valueLabel = numberFormat.format(value);

    return (
        <VStack>
            <HStack>
                <Text {...props}>{label}</Text>
                {help && (
                    <Tooltip
                        placement="top"
                        label={help}
                        fontSize="small"
                        bg="black"
                        color="white"
                    >
                        <Icon />
                    </Tooltip>
                )}
            </HStack>
            {value && (
                <Text fontSize="xxx-large" {...props}>
                    {valueLabel}
                </Text>
            )}
            {!value && <Text>-</Text>}
        </VStack>
    );
};

export default Stats;
