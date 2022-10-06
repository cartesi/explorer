// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import {
    Td,
    Tr,
    useColorModeValue,
    Link,
    Tooltip,
    Icon,
    Box,
    HStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { LockIcon } from '@chakra-ui/icons';
import { StakingPoolFlat } from '../../../graphql/models';
import Address from '../../../components/Address';
import { formatCTSI } from '../../../utils/token';
import { StakeIcon } from '../../Icons';
import labels from '../../../utils/labels';

export interface PoolPerformanceExtendedTableRowProps {
    chainId: number;
    pool: StakingPoolFlat;
    account?: string;
}

const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
});

const apr = (value: number, days: number) =>
    Math.pow(Math.pow(value + 1, 1 / days), 365) - 1;

const PoolPerformanceExtendedTableRow: FunctionComponent<
    PoolPerformanceExtendedTableRowProps
> = ({ chainId, account, pool }) => {
    const borderColor = useColorModeValue('gray.100', 'header');

    // accrued commission
    const accruedCommissionLabel =
        pool.commissionPercentage !== null
            ? numberFormat.format(pool.commissionPercentage)
            : '-';

    // commission label
    let commissionLabel = '';
    if (pool.feeCommission !== undefined) {
        commissionLabel = `${(pool.feeCommission / 100).toFixed(2)} %`;
    } else if (pool.feeGas !== undefined) {
        commissionLabel = `${pool.feeGas} Gas`;
    }

    // commission help tooptip
    let commissionTooltip: string = undefined;
    if (pool.feeCommission !== undefined) {
        commissionTooltip = labels.flatRateCommission;
    } else if (pool.feeGas !== undefined) {
        commissionTooltip = labels.gasTaxCommission;
    }

    // poor manager is logged user, allow edit
    const edit = account && account.toLowerCase() === pool.manager;

    return (
        <Tr key={pool.id} data-testid="pool-performance-extended-table-row">
            <Td borderColor={borderColor} data-testid="address-col">
                <HStack>
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
                        minWidth="120px"
                        shouldDisplayFallbackAvatar
                    />

                    {pool.paused && (
                        <Tooltip
                            placement="top"
                            label="This pool is not accepting stake at the moment"
                            fontSize="small"
                            bg="black"
                            color="white"
                        >
                            <LockIcon
                                w={2.5}
                                h={2.5}
                                data-testid="paused-tooltip-icon"
                            />
                        </Tooltip>
                    )}
                </HStack>
            </Td>
            <Td
                isNumeric
                borderColor={borderColor}
                data-testid="total-users-col"
            >
                {pool.totalUsers}
            </Td>
            <Td isNumeric borderColor={borderColor} data-testid="amount-col">
                {formatCTSI(pool.amount, 2)} CTSI
            </Td>
            <Td
                isNumeric
                borderColor={borderColor}
                data-testid="total-reward-col"
            >
                {formatCTSI(pool.userTotalReward, 2)} CTSI
            </Td>
            <Td
                isNumeric
                borderColor={borderColor}
                data-testid="week-performance-col"
            >
                {numberFormat.format(pool.weekPerformance)} (
                {numberFormat.format(apr(pool.weekPerformance, 7))})
            </Td>
            <Td
                isNumeric
                borderColor={borderColor}
                data-testid="month-performance-col"
            >
                {numberFormat.format(pool.monthPerformance)} (
                {numberFormat.format(apr(pool.monthPerformance, 30))})
            </Td>
            <Td borderColor={borderColor} data-testid="commission-col">
                {commissionLabel}{' '}
                {commissionTooltip && (
                    <Tooltip
                        placement="top"
                        label={commissionTooltip}
                        fontSize="small"
                        bg="black"
                        color="white"
                        size="md"
                    >
                        <Icon w={2.5} h={2.5} />
                    </Tooltip>
                )}
            </Td>
            <Td borderColor={borderColor} data-testid="accrued-commission-col">
                {accruedCommissionLabel}
            </Td>
            <Td
                isNumeric
                borderColor={borderColor}
                position={['sticky', 'sticky', 'initial', 'initial']}
                top={0}
                right={0}
                backgroundColor={['white', 'white', 'transparent']}
                padding={0}
                data-testid="stake-info-col"
            >
                <Box
                    shadow={['md', 'md', 'none', 'none']}
                    padding={[0, 0, 8, 8]}
                    minHeight={['80px', '80px', 'auto', 'auto']}
                    width={['80px', '80px', 'auto', 'auto']}
                    display={['flex', 'flex', 'block', 'block']}
                    alignItems="center"
                    justifyContent="center"
                    ml="auto"
                >
                    <NextLink href={`/stake/${pool.id}`}>
                        <Link mr={[0, 0, 3]} data-testid="stake-info-link">
                            <StakeIcon w={8} h={8} />
                        </Link>
                    </NextLink>
                </Box>
            </Td>
        </Tr>
    );
};

export default PoolPerformanceExtendedTableRow;
