// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import {
    Box,
    FlexProps,
    HStack,
    Heading,
    SystemProps,
    Text,
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import { StakingPoolFee } from '../graphql/models';

const formatPercent = (value: number, options?: Intl.NumberFormatOptions) => {
    const formatter = new Intl.NumberFormat('en-US', options);
    return formatter.format(value * 100);
};

export interface CommissionTextProps extends FlexProps {
    icon?: IconType;
    value: StakingPoolFee;
    direction?: SystemProps['flexDirection'];
    options?: Intl.NumberFormatOptions;
    componentStyle?: string;
}

const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
};

const CommissionText: FC<CommissionTextProps> = (props) => {
    const {
        children,
        value,
        direction = 'column',
        icon,
        options = defaultOptions,
        componentStyle = 'default',
        ...flexProps
    } = props;

    const numberFormat = new Intl.NumberFormat('en-US', options);
    const unitLabel = value?.commission ? '%' : value?.gas ? 'gas' : '';
    const valueLabel = value?.commission
        ? formatPercent(value.commission / 10000)
        : value?.gas
        ? numberFormat.format(value.gas)
        : '-';

    const styles = {
        default: {
            as: 'h2',
            size: 'lg',
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
                >
                    {valueLabel}
                </Heading>
                {unitLabel && valueLabel && (
                    <Text size={'base'} color="gray.500">
                        {unitLabel}
                    </Text>
                )}
            </HStack>
        </Box>
    );
};

export default CommissionText;
