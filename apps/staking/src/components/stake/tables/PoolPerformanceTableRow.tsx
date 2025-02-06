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
    TableCellProps,
    Td,
    Tooltip,
    Tr,
    useColorModeValue,
} from '@chakra-ui/react';
import { first, last } from 'lodash/fp';
import NextLink from 'next/link';
import { FC, useState } from 'react';
import { StakingPool } from '../../../graphql/models';
import labels from '../../../utils/labels';
import { formatCTSI } from '../../../utils/token';
import Address from '../../Address';
import { StakeIcon } from '../../Icons';

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
    const borderColor = useColorModeValue('gray.100', 'dark.gray.quinary');
    const parsedWeekly = parseOrDefault(weekly);
    const parsedMonthly = parseOrDefault(monthly);

    return (
        <>
            <Td
                isNumeric
                borderColor={borderColor}
                paddingTop={4}
                paddingBottom={4}
                data-testid="week-performance-col"
            >
                {numberFormat.format(parsedWeekly)} (
                {numberFormat.format(apr(parsedWeekly, 7))})
            </Td>
            <Td
                isNumeric
                borderColor={borderColor}
                paddingTop={4}
                paddingBottom={4}
                data-testid="month-performance-col"
            >
                {numberFormat.format(parsedMonthly)} (
                {numberFormat.format(apr(parsedMonthly, 30))})
            </Td>
        </>
    );
};

const PoolPerformanceTableRow: FC<PoolPerformanceTableRowProps> = ({
    chainId,
    pool,
    keepActionColVisible,
}) => {
    // accrued commission
    const accruedCommissionLabel =
        pool.commissionPercentage !== null
            ? numberFormat.format(pool.commissionPercentage)
            : '-';

    // commission label
    const commissionLabel = `${(pool.fee.commission / 100).toFixed(2)} %`;

    // commission help tooltip
    const commissionTooltip: string = labels.flatRateCommission;

    const [isHovered, setHovered] = useState(false);
    const backgroundColor = useColorModeValue('white', 'dark.gray.primary');
    const backgroundHoverColor = useColorModeValue(
        'WhiteSmoke',
        'dark.gray.tertiary'
    );
    const borderColor = useColorModeValue('gray.100', 'dark.gray.quinary');
    const linkHoverColor = useColorModeValue('dark.secondary', 'dark.primary');
    const linkColor = useColorModeValue('gray.900', 'dark.primary');
    const addressColor = useColorModeValue('gray.900', 'white');
    const stakeInfoBg = useColorModeValue('white', 'dark.gray.primary');
    const tdProps: TableCellProps = {
        borderColor,
        paddingTop: 4,
        paddingBottom: 4,
    };

    return (
        <Tr
            key={pool.id}
            id={pool.id}
            data-testid="pool-performance-table-row"
            bg={backgroundColor}
            _hover={{ backgroundColor: backgroundHoverColor }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Td data-testid="address-col" {...tdProps}>
                <HStack>
                    <Address
                        ens
                        address={pool.id}
                        chainId={chainId}
                        truncated
                        size="md"
                        minWidth="120px"
                        textDecoration="underline"
                        px="0.5rem"
                        py="0.25rem"
                        color={addressColor}
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
            <Td isNumeric data-testid="total-users-col" {...tdProps}>
                {pool.totalUsers}
            </Td>
            <Td isNumeric data-testid="amount-col" {...tdProps}>
                {formatCTSI(pool.amount, 2)} CTSI
            </Td>
            <Td isNumeric data-testid="total-reward-col" {...tdProps}>
                {formatCTSI(pool.user.totalReward, 2)} CTSI
            </Td>

            <Performance
                key={`perf-${pool.id}`}
                weekly={first(pool.weeklyPerformance)?.performance}
                monthly={last(pool.monthlyPerformance)?.performance}
            />

            <Td data-testid="commission-col" {...tdProps}>
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
            <Td data-testid="accrued-commission-col" {...tdProps}>
                {accruedCommissionLabel}
            </Td>
            <Td
                isNumeric
                position={keepActionColVisible ? 'sticky' : 'initial'}
                top={0}
                right={0}
                padding={0}
                data-testid="stake-info-col"
                backgroundColor={isHovered ? backgroundHoverColor : stakeInfoBg}
                {...tdProps}
            >
                <Box
                    transition="all 0.2s ease-in"
                    shadow={keepActionColVisible ? 'md' : 'none'}
                    paddingY={[0, 0, 6, 6]}
                    paddingX={[0, 0, '48px', '48px']}
                    minHeight={['78px', '80px', 'auto', 'auto']}
                    width={['80px', '80px', 'auto', 'auto']}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    ml="auto"
                >
                    <NextLink href={`/stake/${pool.id}`} passHref>
                        <Link
                            data-testid="stake-info-link"
                            color={linkColor}
                            _hover={{
                                color: linkHoverColor,
                            }}
                        >
                            <StakeIcon w={8} h={8} />
                        </Link>
                    </NextLink>
                </Box>
            </Td>
        </Tr>
    );
};

export default PoolPerformanceTableRow;
