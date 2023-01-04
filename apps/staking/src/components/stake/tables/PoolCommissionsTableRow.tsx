// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Td, Tr, useColorModeValue } from '@chakra-ui/react';
import {
    StakingPoolFeeHistory,
    StakingPoolFeeType,
} from '../../../graphql/models';

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
    hourCycle: 'h23',
    dateStyle: 'medium',
    timeStyle: 'short',
});

const DIVISOR_FOR_PERCENT_STYLE = 10000;
const formatNumber = (value: number, opts?: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat('en-US', opts).format(value);

export interface PoolCommissionsTableRowProps {
    data: StakingPoolFeeHistory;
}

const PoolCommissionsTableRow: FC<PoolCommissionsTableRowProps> = ({
    data,
}) => {
    const borderColor = useColorModeValue('gray.100', 'header');

    return (
        <Tr data-testid="pool-commissions-table-row">
            <Td
                borderColor={borderColor}
                textAlign="left"
                data-testid="timestamp-col"
            >
                {dateTimeFormat.format(data.timestamp * 1000)}
            </Td>

            <Td borderColor={borderColor} data-testid="new-value-col" isNumeric>
                {data.feeType === StakingPoolFeeType.FLAT_RATE
                    ? formatNumber(data.newValue / DIVISOR_FOR_PERCENT_STYLE, {
                          style: 'percent',
                          maximumFractionDigits: 2,
                      })
                    : formatNumber(data.newValue)}
            </Td>

            <Td
                borderColor={borderColor}
                data-testid="percentage-col"
                isNumeric
            >
                {data.feeType === StakingPoolFeeType.FLAT_RATE
                    ? formatNumber(data.change / DIVISOR_FOR_PERCENT_STYLE, {
                          style: 'percent',
                          maximumFractionDigits: 2,
                          signDisplay: 'exceptZero',
                      })
                    : formatNumber(data.change, { signDisplay: 'exceptZero' })}
            </Td>
        </Tr>
    );
};

export default PoolCommissionsTableRow;
