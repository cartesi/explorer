// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import { HStack, Text, TextProps, VStack } from '@chakra-ui/react';

export type MarketInfoUnit = 'USD' | 'CTSI';

export interface MarketInfoProps extends TextProps {
    label: string;
    value: number;
    unit: MarketInfoUnit;
    fractionDigits?: number;
}

const MarketInfo: FunctionComponent<MarketInfoProps> = (props) => {
    const { fractionDigits = 4, label, value, unit } = props;

    const numberFormat =
        unit == 'USD'
            ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: fractionDigits,
              })
            : new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: fractionDigits,
              });
    const valueLabel = numberFormat.format(value);

    return (
        <VStack align="flex-start">
            <Text fontSize="small" {...props}>
                {label}
            </Text>
            {value && (
                <HStack align="baseline">
                    <Text fontWeight="bold" {...props}>
                        {valueLabel}
                    </Text>
                    <Text fontSize="small" {...props}>
                        {unit}
                    </Text>
                </HStack>
            )}
            {!value && <Text>-</Text>}
        </VStack>
    );
};

export default MarketInfo;
