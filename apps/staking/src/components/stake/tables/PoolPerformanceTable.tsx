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
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react';
import { GhostButton } from '@explorer/ui';
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
    const borderColor = useColorModeValue('white', 'gray.700');
    const colSpans = 11;
    return (
        <TableResponsiveHolder ref={tableRef}>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Pool Address</Th>

                        <Th isNumeric>
                            <Flex direction={'row'} alignItems={'center'}>
                                <GhostButton
                                    marginRight={'2'}
                                    fontSize="xs"
                                    fontWeight="bold"
                                    _hover={{ color: 'blue.400' }}
                                    onClick={() => onSort('totalUsers')}
                                >
                                    Total Users
                                </GhostButton>
                                {sort == 'totalUsers' && <ArrowDownIcon />}
                            </Flex>
                        </Th>

                        <Th isNumeric>
                            <Flex direction={'row'} alignItems={'center'}>
                                <GhostButton
                                    marginRight={'2'}
                                    fontSize="xs"
                                    fontWeight="bold"
                                    _hover={{ color: 'blue.400' }}
                                    onClick={() => onSort('amount')}
                                >
                                    Total Staked
                                </GhostButton>
                                {sort == 'amount' && <ArrowDownIcon />}
                            </Flex>
                        </Th>

                        <Th isNumeric>Total Rewards</Th>

                        <Th isNumeric whiteSpace="nowrap" data-testid="">
                            <Text whiteSpace="nowrap">7-days % (Annual)</Text>
                        </Th>

                        <Th isNumeric whiteSpace="nowrap">
                            <Text whiteSpace="nowrap">30-days % (Annual)</Text>
                        </Th>

                        <Th>Configured Commission</Th>
                        <Th>
                            <Flex direction={'row'} alignItems={'center'}>
                                <GhostButton
                                    marginRight={'2'}
                                    fontSize="xs"
                                    fontWeight="bold"
                                    _hover={{ color: 'blue.400' }}
                                    onClick={() =>
                                        onSort('commissionPercentage')
                                    }
                                >
                                    Accrued Commission
                                </GhostButton>{' '}
                                {sort == 'commissionPercentage' && (
                                    <ArrowDownIcon />
                                )}
                            </Flex>
                        </Th>

                        <Th isNumeric position="initial" ref={thRef}>
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
