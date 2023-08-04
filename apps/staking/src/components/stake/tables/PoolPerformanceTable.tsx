// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ArrowDownIcon } from '@chakra-ui/icons';
import {
    Flex,
    HStack,
    Spinner,
    Table,
    TableColumnHeaderProps,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react';
import { GhostButton, theme } from '@explorer/ui';
import { FC, useRef } from 'react';
import { StakingPool, StakingPoolSort } from '../../../graphql/models';
import { useVisibilityThreshold } from '../../../utils/hooks/useVisibilityThreshold';
import { TableResponsiveHolder } from '../../TableResponsiveHolder';
import { SlideInOut } from '../../animation/SlideInOut';
import PoolPerformanceTableRow from './PoolPerformanceTableRow';

export interface PoolPerformanceTableProps {
    chainId: number;
    loading: boolean;
    data?: StakingPool[];
    sort?: StakingPoolSort;
    onSort: (order: StakingPoolSort) => void;
}

const PoolPerformanceTable: FC<PoolPerformanceTableProps> = ({
    chainId,
    data,
    loading,
    sort,
    onSort,
}) => {
    const stakeText = useBreakpointValue(['Info', 'Info', 'Stake/Info']);
    const hasItems = data?.length > 0;
    const thRef = useRef<HTMLTableCellElement>();
    const tableRef = useRef<HTMLDivElement>();
    const threshold = useVisibilityThreshold(tableRef.current, thRef.current);
    const colSpans = 11;
    const headerColor = useColorModeValue('header', 'dark.gray.primary');
    const borderColor = useColorModeValue(
        'transparent',
        'dark.gray.quaternary'
    );
    const topBorderColor = useColorModeValue(
        'transparent',
        'dark.gray.quinary'
    );
    const buttonHoverColor = useColorModeValue('gray.90', 'dark.gray.quinary');

    const thProps: TableColumnHeaderProps = {
        borderColor: topBorderColor,
        bg: headerColor,
        textTransform: 'none',
        fontSize: 'md',
        fontWeight: 400,
        fontFamily: theme.fonts.body,
        paddingTop: 2,
        paddingBottom: 2,
    };

    return (
        <TableResponsiveHolder
            ref={tableRef}
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="3px"
        >
            <Table>
                <Thead>
                    <Tr>
                        <Th {...thProps}>Pool Address</Th>

                        <Th isNumeric {...thProps}>
                            <Flex direction={'row'} alignItems={'center'}>
                                <GhostButton
                                    height="auto"
                                    fontSize="md"
                                    fontWeight={400}
                                    textTransform="none"
                                    _hover={{ color: buttonHoverColor }}
                                    fontFamily={theme.fonts.body}
                                    onClick={() => onSort('totalUsers')}
                                >
                                    Total Users
                                </GhostButton>
                                {sort == 'totalUsers' && (
                                    <ArrowDownIcon
                                        marginLeft={4}
                                        width={5}
                                        height={5}
                                    />
                                )}
                            </Flex>
                        </Th>

                        <Th isNumeric {...thProps}>
                            <Flex direction={'row'} alignItems={'center'}>
                                <GhostButton
                                    height="auto"
                                    fontSize="md"
                                    fontWeight={400}
                                    textTransform="none"
                                    _hover={{ color: buttonHoverColor }}
                                    fontFamily={theme.fonts.body}
                                    onClick={() => onSort('amount')}
                                >
                                    Total Staked
                                </GhostButton>
                                {sort == 'amount' && (
                                    <ArrowDownIcon
                                        marginLeft={4}
                                        width={5}
                                        height={5}
                                    />
                                )}
                            </Flex>
                        </Th>

                        <Th isNumeric {...thProps}>
                            Total Rewards
                        </Th>

                        <Th
                            isNumeric
                            whiteSpace="nowrap"
                            data-testid=""
                            {...thProps}
                        >
                            <Text whiteSpace="nowrap">7-days % (Annual)</Text>
                        </Th>

                        <Th isNumeric whiteSpace="nowrap" {...thProps}>
                            <Text whiteSpace="nowrap">30-days % (Annual)</Text>
                        </Th>

                        <Th {...thProps}>Configured Commission</Th>
                        <Th {...thProps}>
                            <Flex direction={'row'} alignItems={'center'}>
                                <GhostButton
                                    height="auto"
                                    fontSize="md"
                                    fontWeight={400}
                                    textTransform="none"
                                    _hover={{ color: buttonHoverColor }}
                                    fontFamily={theme.fonts.body}
                                    onClick={() =>
                                        onSort('commissionPercentage')
                                    }
                                >
                                    Accrued Commission
                                </GhostButton>{' '}
                                {sort == 'commissionPercentage' && (
                                    <ArrowDownIcon
                                        marginLeft={4}
                                        width={5}
                                        height={5}
                                    />
                                )}
                            </Flex>
                        </Th>

                        <Th
                            isNumeric
                            position="initial"
                            ref={thRef}
                            {...thProps}
                        >
                            {stakeText}
                        </Th>
                        {threshold.isBelow && (
                            <Th
                                isNumeric
                                position="sticky"
                                top={0}
                                right={0}
                                minWidth={{ base: '80px', md: '127px' }}
                                height="73px"
                                padding={0}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                borderColor={borderColor}
                                borderBottomWidth={[0, '1px', 0, 0]}
                                {...thProps}
                            >
                                <SlideInOut display={true}>
                                    {stakeText}
                                </SlideInOut>
                            </Th>
                        )}
                    </Tr>
                </Thead>

                <Tbody>
                    {loading ? (
                        <Tr>
                            <Td colSpan={colSpans} textAlign="center">
                                <HStack justify="center">
                                    <Spinner />
                                    <Text>Loading</Text>
                                </HStack>
                            </Td>
                        </Tr>
                    ) : hasItems ? (
                        data.map((pool) => (
                            <PoolPerformanceTableRow
                                key={pool.id}
                                chainId={chainId}
                                pool={pool}
                                keepActionColVisible={threshold.isBelow}
                            />
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={colSpans} textAlign="center">
                                <Text>No items</Text>
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </TableResponsiveHolder>
    );
};

export default PoolPerformanceTable;
