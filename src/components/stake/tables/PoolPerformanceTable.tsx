// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Flex,
    HStack,
    Icon,
    Spinner,
    Table,
    TableColumnHeaderProps,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { FC, useRef } from 'react';
import { StakingPool, StakingPoolSort } from '../../../graphql/models';
import theme from '../../../styles/theme';
import { useVisibilityThreshold } from '../../../utils/hooks/useVisibilityThreshold';
import { GhostButton } from '../../GhostButton';
import { TableResponsiveHolder } from '../../TableResponsiveHolder';
import { SlideInOut } from '../../animation/SlideInOut';
import PoolPerformanceTableRow from './PoolPerformanceTableRow';
import { useColorModeValue } from '../../ui/color-mode';
import { FaArrowDown } from 'react-icons/fa';

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
        color: 'white',
        borderColor: topBorderColor,
        bg: 'dark.gray.primary',
        textTransform: 'none',
        fontSize: 'md',
        fontWeight: 400,
        fontFamily: theme.tokens.getVar('fonts.body'),
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
            <Table.Root width="max-content">
                <Table.Header>
                    <Table.Row>
                        <Table.Cell {...thProps} borderTopLeftRadius="6px">
                            Pool Address
                        </Table.Cell>

                        <Table.Cell textAlign="right" {...thProps}>
                            <Flex direction={'row'} alignItems={'center'}>
                                <GhostButton
                                    height="auto"
                                    fontSize="md"
                                    fontWeight={400}
                                    textTransform="none"
                                    _hover={{ color: buttonHoverColor }}
                                    fontFamily={theme.tokens.getVar(
                                        'fonts.body'
                                    )}
                                    onClick={() => onSort('totalUsers')}
                                >
                                    Total Users
                                </GhostButton>
                                {sort === 'totalUsers' && (
                                    <Icon as={FaArrowDown} w={5} h={5} ml={4} />
                                )}
                            </Flex>
                        </Table.Cell>

                        <Table.Cell textAlign="right" {...thProps}>
                            <Flex
                                direction={'row'}
                                alignItems={'center'}
                                justifyContent="flex-end"
                            >
                                <GhostButton
                                    height="auto"
                                    fontSize="md"
                                    fontWeight={400}
                                    textTransform="none"
                                    _hover={{ color: buttonHoverColor }}
                                    fontFamily={theme.tokens.getVar(
                                        'fonts.body'
                                    )}
                                    onClick={() => onSort('amount')}
                                >
                                    Total Staked
                                </GhostButton>
                                {sort === 'amount' && (
                                    <Icon as={FaArrowDown} w={5} h={5} ml={4} />
                                )}
                            </Flex>
                        </Table.Cell>

                        <Table.Cell textAlign="right" {...thProps}>
                            Total Rewards
                        </Table.Cell>

                        <Table.Cell
                            whiteSpace="nowrap"
                            data-testid=""
                            textAlign="right"
                            {...thProps}
                        >
                            <Text whiteSpace="nowrap">7-days % (Annual)</Text>
                        </Table.Cell>

                        <Table.Cell
                            whiteSpace="nowrap"
                            textAlign="right"
                            {...thProps}
                        >
                            <Text whiteSpace="nowrap">30-days % (Annual)</Text>
                        </Table.Cell>

                        <Table.Cell {...thProps}>
                            Configured Commission
                        </Table.Cell>
                        <Table.Cell {...thProps}>
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
                                    fontFamily={theme.tokens.getVar(
                                        'fonts.body'
                                    )}
                                    onClick={() =>
                                        onSort('commissionPercentage')
                                    }
                                >
                                    Accrued Commission
                                </GhostButton>{' '}
                                {sort == 'commissionPercentage' && (
                                    <Icon as={FaArrowDown} w={5} h={5} ml={4} />
                                )}
                            </Flex>
                        </Table.Cell>

                        <Table.Cell
                            position="initial"
                            ref={thRef}
                            borderTopRightRadius="6px"
                            textAlign="right"
                            {...thProps}
                        >
                            {stakeText}
                        </Table.Cell>
                        {threshold.isBelow && (
                            <Table.Cell
                                position="sticky"
                                top={0}
                                right={0}
                                textAlign="right"
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
                            </Table.Cell>
                        )}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {loading ? (
                        <Table.Row>
                            <Table.Cell colSpan={colSpans} textAlign="center">
                                <HStack justify="center">
                                    <Spinner />
                                    <Text>Loading</Text>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
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
                        <Table.Row>
                            <Table.Cell colSpan={colSpans} textAlign="center">
                                <Text>No items</Text>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
        </TableResponsiveHolder>
    );
};

export default PoolPerformanceTable;
