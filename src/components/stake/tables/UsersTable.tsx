// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { HStack, Spinner, Table, TableCellProps, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { PoolBalanceWithAccumulatedShares } from '../../../graphql/models';
import theme from '../../../styles/theme';
import { TableResponsiveHolder } from '../../TableResponsiveHolder';
import UsersTableRow from './UsersTableRow';
import { useColorModeValue } from '../../ui/color-mode';

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
        fontFamily: theme.tokens.getVar('fonts.body'),
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
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Cell {...thProps} borderTopLeftRadius="6px">
                            User
                        </Table.Cell>
                        <Table.Cell {...thProps}>Stake Since</Table.Cell>
                        <Table.Cell {...thProps}>Total Staked</Table.Cell>
                        <Table.Cell {...thProps}>Shares</Table.Cell>
                        <Table.Cell {...thProps} borderTopRightRadius="6px">
                            Accumulated Shares
                        </Table.Cell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {loading ? (
                        <Table.Row>
                            <Table.Cell colSpan={9} textAlign="center">
                                <HStack justify="center">
                                    <Spinner />
                                    <Text>Loading...</Text>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    ) : hasItems ? (
                        data.map((balance) => (
                            <UsersTableRow
                                key={balance.user.id}
                                chainId={chainId}
                                balance={balance}
                            />
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={9} textAlign="center">
                                <Text>No items</Text>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
        </TableResponsiveHolder>
    );
};

export default UsersTable;
