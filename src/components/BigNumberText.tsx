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
import { BigNumber, BigNumberish } from 'ethers';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import { formatCTSI } from '../utils/token';

export interface BigNumberTextProps extends TextProps {
    icon?: IconType;
    value: BigNumberish;
    nullLabel?: string;
    fractionDigits?: number;
    direction?: SystemProps['flexDirection'];
    unit?: 'ETH' | 'CTSI' | '%';
}

const BigNumberText: FC<BigNumberTextProps> = (props) => {
    const {
        children,
        value,
        nullLabel = '-',
        fractionDigits = 4,
        direction = 'column',
        icon,
        unit,
        ...textProps
    } = props;
    const valueLabel = !value
        ? nullLabel
        : unit == 'ETH'
        ? formatCTSI(value, fractionDigits)
        : unit == 'CTSI'
        ? formatCTSI(value, fractionDigits)
        : unit == '%'
        ? BigNumber.from(value).mul(100).toNumber().toFixed(fractionDigits)
        : value.toString();

    return (
        <Flex direction={direction} align="baseline" justify="space-between">
            <HStack>
                {icon && <Icon as={icon} color={props.color} />}
                {children}
            </HStack>
            <HStack align="baseline">
                <Text fontSize="xx-large" {...textProps}>
                    {valueLabel}
                </Text>
                {unit && value && (
                    <Text fontSize="small" {...textProps}>
                        {unit}
                    </Text>
                )}
            </HStack>
        </Flex>
    );
};

export default BigNumberText;
