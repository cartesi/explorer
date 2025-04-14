// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    HStack,
    Spinner,
    Table,
    TableColumnHeaderProps,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import { FC, useRef } from 'react';
import { PoolBalance } from '../../../graphql/models';
import theme from '../../../styles/theme';
import { useVisibilityThreshold } from '../../../utils/hooks/useVisibilityThreshold';
import { SlideInOut } from '../../animation/SlideInOut';
import { TableResponsiveHolder } from '../../TableResponsiveHolder';
import UserStakingPoolsTableRow from './UserStakingPoolsTableRow';
import { useColorModeValue } from '../../ui/color-mode';

export interface UserStakingPoolsTableProps {
    chainId: number;
    account?: string;
    loading: boolean;
    data?: PoolBalance[];
}

const UserStakingPoolsTable: FC<UserStakingPoolsTableProps> = ({
    chainId,
    account,
    data,
    loading,
}) => {
    const columns = useBreakpointValue([3, 3, 4, 8]);
    const stakeText = useBreakpointValue(['Info', 'Info', 'Stake/Info']);
    const hasItems = data?.length > 0;
    const thRef = useRef<HTMLTableCellElement>(null);
    const tableRef = useRef<HTMLDivElement>(null);
    const threshold = useVisibilityThreshold(tableRef.current, thRef.current);
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
        color: 'white',
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
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Cell {...thProps} borderTopLeftRadius="6px">
                            Pool Address
                        </Table.Cell>
                        <Table.Cell {...thProps}>Unstaked</Table.Cell>
                        <Table.Cell {...thProps}>Staked</Table.Cell>
                        <Table.Cell {...thProps}>% Pool</Table.Cell>
                        <Table.Cell
                            ref={thRef}
                            borderTopRightRadius="6px"
                            {...thProps}
                        >
                            {stakeText}
                        </Table.Cell>
                        {threshold.isBelow && (
                            <Table.Cell
                                position="sticky"
                                top={0}
                                right={0}
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
                            <Table.Cell colSpan={columns} textAlign="center">
                                <HStack justify="center">
                                    <Spinner />
                                    <Text>Loading</Text>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    ) : hasItems ? (
                        data.map((balance) => (
                            <UserStakingPoolsTableRow
                                key={balance.pool.id}
                                chainId={chainId}
                                balance={balance}
                                account={account}
                                keepActionColVisible={threshold.isBelow}
                            />
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={columns} textAlign="center">
                                <Text>No items</Text>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
        </TableResponsiveHolder>
    );
};

export default UserStakingPoolsTable;
