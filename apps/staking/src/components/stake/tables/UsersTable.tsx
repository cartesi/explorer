// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import {
    Table,
    Tbody,
    Td,
    Text,
    Tr,
    Th,
    Thead,
    HStack,
    Spinner,
    useColorModeValue,
    TableCellProps,
} from '@chakra-ui/react';
import UsersTableRow from './UsersTableRow';
import { PoolBalanceWithAccumulatedShares } from '../../../graphql/models';
import { TableResponsiveHolder } from '../../TableResponsiveHolder';
import { theme } from '@explorer/ui';

export interface UsersTableProps {
    chainId: number;
    loading: boolean;
    data?: PoolBalanceWithAccumulatedShares[];
}

const UsersTable: FC<UsersTableProps> = (props) => {
    const { chainId, data, loading } = props;
    const hasItems = data?.length > 0;
    const headerColor = 'dark.gray.primary';
    const borderColor = useColorModeValue(
        'transparent',
        'dark.gray.quaternary'
    );
    const topBorderColor = useColorModeValue(
        'transparent',
        'dark.gray.quinary'
    );
    const thProps: TableCellProps = {
        paddingTop: 4,
        paddingBottom: 4,
        fontFamily: theme.fonts.body,
        fontWeight: 400,
        fontSize: 'md',
        textTransform: 'none',
        borderColor: topBorderColor,
        bg: headerColor,
    };

    return (
        <TableResponsiveHolder
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="6px"
        >
            <Table>
                <Thead>
                    <Tr>
                        <Th {...thProps} borderTopLeftRadius="6px">
                            User
                        </Th>
                        <Th {...thProps}>Stake Since</Th>
                        <Th {...thProps}>Total Staked</Th>
                        <Th isNumeric {...thProps}>
                            Shares
                        </Th>
                        <Th isNumeric {...thProps} borderTopRightRadius="6px">
                            Accumulated Shares
                        </Th>
                    </Tr>
                </Thead>

                <Tbody>
                    {loading ? (
                        <Tr>
                            <Td colSpan={9} textAlign="center">
                                <HStack justify="center">
                                    <Spinner />
                                    <Text>Loading...</Text>
                                </HStack>
                            </Td>
                        </Tr>
                    ) : hasItems ? (
                        data.map((balance) => (
                            <UsersTableRow
                                key={balance.user.id}
                                chainId={chainId}
                                balance={balance}
                            />
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={9} textAlign="center">
                                <Text>No items</Text>
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </TableResponsiveHolder>
    );
};

export default UsersTable;
