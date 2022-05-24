// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Text, TextProps } from '@chakra-ui/react';
import { BigNumberish } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { FC } from 'react';

export interface CTSIProps extends TextProps {
    value: BigNumberish;
}

const CTSI: FC<CTSIProps> = ({ value, ...textProps }) => {
    // formatter for CTSI values
    const numberFormat = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    return (
        <Text fontSize="2xl" fontWeight="bold" {...textProps}>
            {numberFormat.format(parseFloat(formatUnits(value, 18)))}
        </Text>
    );
};

export default CTSI;
