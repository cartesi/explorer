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
import { FC, useRef } from 'react';
import { StakingPool, StakingPoolSort } from '../../../graphql/models';
import theme from '../../../styles/theme';
import { useVisibilityThreshold } from '../../../utils/hooks/useVisibilityThreshold';
import { GhostButton } from '../../GhostButton';
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
    const thRef = useRef<HTMLTableCellElement>(null);
    const tableRef = useRef<HTMLDivElement>(null);
    const threshold = useVisibilityThreshold(tableRef.current, thRef.current);
    const colSpans = 11;
    const buttonHoverColor = useColorModeValue('gray.90', 'dark.gray.quinary');
    const borderColor = useColorModeValue(
        'transparent',
        'dark.gray.quaternary'
    );
    const topBorderColor = useColorModeValue(
        'transparent',
        'dark.gray.quinary'
    );

    const thProps: TableColumnHeaderProps = {
        borderColor: topBorderColor,
        bg: 'dark.gray.primary',
        textTransform: 'none',
        fontSize: 'md',
        fontWeight: 400,
        fontFamily: theme.fonts.body,
        paddingTop: 4,
        paddingBottom: 4,
    };

    return (
        <TableResponsiveHolder
            ref={tableRef}
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="6px"
        >
            <Table>
                <Thead>
                    <Tr>
                        <Th {...thProps} borderTopLeftRadius="6px">
                            Pool Address
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
                            <Flex
                                height="auto"
                                direction={'row'}
                                alignItems={'center'}
                            >
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
                            borderTopRightRadius="6px"
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
                                borderTopRightRadius="6px"
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
