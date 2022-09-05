// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import { Td, Tr, useColorModeValue, Link, Tag } from '@chakra-ui/react';
import { StakingPoolFlat } from '../../graphql/models';
import Address from '../../components/Address';
import { formatCTSI } from '../../utils/token';
import { StakeInfo } from '../Icons';

export interface PoolPerformanceTableRowProps {
    chainId: number;
    pool: StakingPoolFlat;
}

const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
});

const apr = (value: number, days: number) =>
    Math.pow(Math.pow(value + 1, 1 / days), 365) - 1;

const PoolPerformanceTableRow: FunctionComponent<
    PoolPerformanceTableRowProps
> = ({ chainId, pool }) => {
    const borderColor = useColorModeValue('gray.100', 'header');

    return (
        <Tr key={pool.id}>
            <Td borderColor={borderColor}>
                <Address
                    ens
                    address={pool.id}
                    chainId={chainId}
                    truncated
                    borderRadius="full"
                    size="md"
                    bg="blue.50"
                    px="0.5rem"
                    py="0.25rem"
                    color="gray.900"
                />
            </Td>
            <Td isNumeric borderColor={borderColor}>
                {pool.totalUsers}
            </Td>
            <Td isNumeric borderColor={borderColor}>
                {formatCTSI(pool.amount, 2)} CTSI
            </Td>
            <Td isNumeric borderColor={borderColor}>
                {numberFormat.format(pool.monthPerformance)} (
                {numberFormat.format(apr(pool.monthPerformance, 30))})
            </Td>
            <Td isNumeric borderColor={borderColor}>
                <Link href={`/stake/${pool.id}`} mr={5}>
                    <StakeInfo w={8} h={8} />
                </Link>
            </Td>
        </Tr>
    );
};

export default PoolPerformanceTableRow;
