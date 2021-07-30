// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import { Flex, HStack, SystemProps, Text, TextProps } from '@chakra-ui/react';
import { BigNumberish } from 'ethers';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import { formatCTSI } from '../utils/token';

export interface CTSITextProps extends TextProps {
    label: string;
    icon?: IconType;
    value: BigNumberish;
    fractionDigits?: number;
    direction?: SystemProps['flexDirection'];
}

const CTSIText: FunctionComponent<CTSITextProps> = (props) => {
    const {
        label,
        value,
        fractionDigits = 4,
        direction = 'column',
        icon,
        ...textProps
    } = props;
    const valueLabel = formatCTSI(value, fractionDigits);

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

export default CTSIText;
