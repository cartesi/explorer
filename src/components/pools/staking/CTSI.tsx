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

export const numberFormat = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

export const parseCtsiValue = (value) =>
    numberFormat.format(parseFloat(formatUnits(value, 18)));

const CTSI: FC<CTSIProps> = ({ value, ...textProps }) => {
    return (
        <Text fontSize="2xl" fontWeight="bold" role="ctsi-text" {...textProps}>
            {parseCtsiValue(value)}
        </Text>
    );
};

export default CTSI;
