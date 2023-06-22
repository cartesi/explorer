// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { LockIcon } from '@chakra-ui/icons';
import {
    Box,
    HStack,
    Icon,
    Link,
    Td,
    Tooltip,
    Tr,
    useColorModeValue,
} from '@chakra-ui/react';
import { Address, StakeIcon } from '@explorer/ui';
import { first, last } from 'lodash/fp';
import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import { StakingPool } from '../../../graphql/models';
import labels from '../../../utils/labels';
import { formatCTSI } from '../../../utils/token';

export interface PoolPerformanceTableRowProps {
    chainId: number;
    pool: StakingPool;
    keepActionColVisible?: boolean;
}

const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
});

const apr = (value: number, days: number) =>
    Math.pow(Math.pow(value + 1, 1 / days), 365) - 1;

type PerformanceProps = {
    weekly?: string;
    monthly?: string;
};

const parseOrDefault = (value?: string) => (value ? parseFloat(value) : 0.0);

const Performance = ({ weekly, monthly }: PerformanceProps) => {
    const borderColor = useColorModeValue('gray.100', 'header');
    const parsedWeekly = parseOrDefault(weekly);
    const parsedMonthly = parseOrDefault(monthly);

    return (
        <>
            <Td
                isNumeric
                borderColor={borderColor}
                data-testid="week-performance-col"
            >
                {numberFormat.format(parsedWeekly)} (
                {numberFormat.format(apr(parsedWeekly, 7))})
            </Td>
            <Td
                isNumeric
                borderColor={borderColor}
                data-testid="month-performance-col"
            >
                {numberFormat.format(parsedMonthly)} (
                {numberFormat.format(apr(parsedMonthly, 30))})
            </Td>
        </>
    );
};

const PoolPerformanceTableRow: FunctionComponent<
    PoolPerformanceTableRowProps
> = ({ chainId, pool, keepActionColVisible }) => {
    const borderColor = useColorModeValue('gray.100', 'header');
    const stakeInfoBg = useColorModeValue('white', 'gray.800');

    // accrued commission
    const accruedCommissionLabel =
        pool.commissionPercentage !== null
            ? numberFormat.format(pool.commissionPercentage)
            : '-';

    let flatRate = pool.fee.commission > 0;
    const gasTax = pool.fee.gas > 0;

    // XXX: if both are zero, currently we don't which is it, for now let's assume it's flat rate
    if (!flatRate && !gasTax) {
        flatRate = true;
    }

    // commission label
    let commissionLabel = '';
    if (flatRate) {
        commissionLabel = `${(pool.fee.commission / 100).toFixed(2)} %`;
    } else if (gasTax) {
        commissionLabel = `${pool.fee.gas} Gas`;
    }

    // commission help tooltip
    let commissionTooltip: string = undefined;
    if (flatRate) {
        commissionTooltip = labels.flatRateCommission;
    } else if (gasTax) {
        commissionTooltip = labels.gasTaxCommission;
    }

    return (
        <Tr key={pool.id} id={pool.id} data-testid="pool-performance-table-row">
            <Td borderColor={borderColor} data-testid="address-col">
                <HStack>
                    <Address
                        ens
                        address={pool.id}
                        chainId={chainId}
                        truncated
                        size="md"
                        bg="blue.50"
                        px="0.5rem"
                        py="0.25rem"
                        color="gray.900"
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
                {formatCTSI(pool.user.totalReward, 2)} CTSI
            </Td>

            <Performance
                key={`perf-${pool.id}`}
                weekly={first(pool.weeklyPerformance)?.performance}
                monthly={last(pool.monthlyPerformance)?.performance}
            />

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
                position={keepActionColVisible ? 'sticky' : 'initial'}
                top={0}
                right={0}
                backgroundColor={stakeInfoBg}
                padding={0}
                data-testid="stake-info-col"
            >
                <Box
                    transition="all 0.2s ease-in"
                    shadow={keepActionColVisible ? 'md' : 'none'}
                    paddingY={[0, 0, 8, 8]}
                    paddingX={[0, 0, '48px', '48px']}
                    minHeight={['78px', '80px', 'auto', 'auto']}
                    width={['80px', '80px', 'auto', 'auto']}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    ml="auto"
                >
                    <NextLink href={`/stake/${pool.id}`} passHref>
                        <Link data-testid="stake-info-link">
                            <StakeIcon w={8} h={8} />
                        </Link>
                    </NextLink>
                </Box>
            </Td>
        </Tr>
    );
};

export default PoolPerformanceTableRow;
