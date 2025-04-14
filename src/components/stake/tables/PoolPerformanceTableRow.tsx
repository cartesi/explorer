// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Flex,
    HStack,
    Link,
    Table,
    TableCellProps,
} from '@chakra-ui/react';
import { first, last } from 'lodash/fp';
import NextLink from 'next/link';
import { FC, useState } from 'react';
import { StakingPool } from '../../../graphql/models';
import labels from '../../../utils/labels';
import { formatCTSI } from '../../../utils/token';
import Address from '../../Address';
import { StakeIcon } from '../../Icons';
import { useColorModeValue } from '../../ui/color-mode';
import { Tooltip } from '../../Tooltip';
import { FaLock, FaRegQuestionCircle } from 'react-icons/fa';

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
            <Table.Cell
                borderColor={borderColor}
                paddingTop={4}
                paddingBottom={4}
                data-testid="week-performance-col"
            >
                {numberFormat.format(parsedWeekly)} (
                {numberFormat.format(apr(parsedWeekly, 7))})
            </Table.Cell>
            <Table.Cell
                borderColor={borderColor}
                paddingTop={4}
                paddingBottom={4}
                data-testid="month-performance-col"
            >
                {numberFormat.format(parsedMonthly)} (
                {numberFormat.format(apr(parsedMonthly, 30))})
            </Table.Cell>
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
        <Table.Row
            key={pool.id}
            id={pool.id}
            data-testid="pool-performance-table-row"
            bg={backgroundColor}
            _hover={{ backgroundColor: backgroundHoverColor }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Table.Cell data-testid="address-col" {...tdProps}>
                <HStack>
                    <Address
                        ens
                        address={pool.id}
                        chainId={chainId}
                        truncated
                        minWidth="120px"
                        textDecoration="underline"
                        px="0.5rem"
                        py="0.25rem"
                        color={addressColor}
                        shouldDisplayFallbackAvatar
                    />

                    {pool.paused && (
                        <Tooltip
                            showArrow
                            content="This pool is not accepting stake at the moment"
                            positioning={{ placement: 'top' }}
                            openDelay={0}
                        >
                            <FaLock width={2.5} height={2.5} />
                        </Tooltip>
                    )}
                </HStack>
            </Table.Cell>
            <Table.Cell data-testid="total-users-col" {...tdProps}>
                {pool.totalUsers}
            </Table.Cell>
            <Table.Cell data-testid="amount-col" {...tdProps}>
                {formatCTSI(pool.amount, 2)} CTSI
            </Table.Cell>
            <Table.Cell data-testid="total-reward-col" {...tdProps}>
                {formatCTSI(pool.user.totalReward, 2)} CTSI
            </Table.Cell>

            <Performance
                key={`perf-${pool.id}`}
                weekly={first(pool.weeklyPerformance)?.performance}
                monthly={last(pool.monthlyPerformance)?.performance}
            />

            <Table.Cell data-testid="commission-col" {...tdProps}>
                <Flex height="auto" direction="row" alignItems="center">
                    {commissionLabel}
                    {commissionTooltip && (
                        <Tooltip
                            showArrow
                            content={commissionTooltip}
                            positioning={{ placement: 'top' }}
                            openDelay={0}
                        >
                            <FaRegQuestionCircle
                                style={{ marginLeft: '0.5rem' }}
                            />
                        </Tooltip>
                    )}
                </Flex>
            </Table.Cell>
            <Table.Cell data-testid="accrued-commission-col" {...tdProps}>
                {accruedCommissionLabel}
            </Table.Cell>
            <Table.Cell
                position={keepActionColVisible ? 'sticky' : 'initial'}
                top={0}
                right={0}
                data-testid="stake-info-col"
                backgroundColor={isHovered ? backgroundHoverColor : stakeInfoBg}
                {...tdProps}
                padding={0}
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
                    <Link
                        as={NextLink}
                        href={`/src/_app/stake/${pool.id}`}
                        data-testid="stake-info-link"
                        color={linkColor}
                        _hover={{
                            color: linkHoverColor,
                        }}
                    >
                        <StakeIcon style={{ width: '2rem', height: '2rem' }} />
                    </Link>
                </Box>
            </Table.Cell>
        </Table.Row>
    );
};

export default PoolPerformanceTableRow;
