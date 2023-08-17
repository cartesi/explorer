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
    HStack,
    Spinner,
    Table,
    Tbody,
    Text,
    Thead,
    Th,
    Tr,
    Td,
    useBreakpointValue,
    useColorModeValue,
    TableCellProps,
} from '@chakra-ui/react';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { User, UserSort } from '../../graphql/models';
import { TableResponsiveHolder } from '../TableResponsiveHolder';
import UserRow from './UserRow';
import { GhostButton, theme } from '@explorer/ui';

export interface UserTableProps {
    chainId: number;
    loading: boolean;
    data?: User[];
    sort?: UserSort;
    onSort: (order: UserSort) => void;
}

const UserTable: FC<UserTableProps> = ({
    chainId,
    data,
    loading,
    sort,
    onSort,
}) => {
    const stakeText = useBreakpointValue(['Info', 'Info', 'Stake/Info']);
    const hasItems = data?.length > 0;
    const borderColor = useColorModeValue(
        'transparent',
        'dark.gray.quaternary'
    );
    const topBorderColor = useColorModeValue(
        'transparent',
        'dark.gray.quinary'
    );
    const buttonHoverColor = useColorModeValue('gray.90', 'dark.gray.quinary');
    const thProps: TableCellProps = {
        bg: 'dark.gray.primary',
        paddingTop: 2,
        paddingBottom: 2,
        borderColor: topBorderColor,
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
                        <Th
                            {...thProps}
                            textTransform="none"
                            fontSize="md"
                            fontWeight={400}
                            borderTopLeftRadius="6px"
                            fontFamily={theme.fonts.body}
                        >
                            User
                        </Th>

                        <Th {...thProps} isNumeric>
                            <GhostButton
                                fontSize="md"
                                fontWeight={400}
                                textTransform="none"
                                _hover={{ color: buttonHoverColor }}
                                fontFamily={theme.fonts.body}
                                onClick={() => onSort('totalBlocks')}
                            >
                                Block Produced
                            </GhostButton>
                            {sort == 'totalBlocks' && (
                                <ArrowDownIcon
                                    marginLeft={4}
                                    width={5}
                                    height={5}
                                />
                            )}
                        </Th>

                        <Th {...thProps} isNumeric>
                            <GhostButton
                                fontSize="md"
                                fontWeight={400}
                                textTransform="none"
                                fontFamily={theme.fonts.body}
                                _hover={{ color: buttonHoverColor }}
                                onClick={() => onSort('balance')}
                            >
                                Total Staked
                            </GhostButton>
                            {sort == 'balance' && (
                                <ArrowDownIcon
                                    marginLeft={4}
                                    width={5}
                                    height={5}
                                />
                            )}
                        </Th>

                        <Th {...thProps} isNumeric>
                            <GhostButton
                                fontSize="md"
                                fontWeight={400}
                                textTransform="none"
                                fontFamily={theme.fonts.body}
                                _hover={{ color: buttonHoverColor }}
                                onClick={() => onSort('totalReward')}
                            >
                                Total Rewards
                            </GhostButton>
                            {sort == 'totalReward' && (
                                <ArrowDownIcon
                                    marginLeft={4}
                                    width={5}
                                    height={5}
                                />
                            )}
                        </Th>

                        <Th
                            {...thProps}
                            isNumeric
                            position={{ base: 'sticky', md: 'initial' }}
                            top={0}
                            right={0}
                            style={{ textAlign: 'center' }}
                            textTransform="none"
                            fontSize="md"
                            fontWeight={400}
                            fontFamily={theme.fonts.body}
                            borderTopRightRadius="6px"
                        >
                            {stakeText}
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
                        data.map((user) => (
                            <UserRow
                                key={user.id}
                                chainId={chainId}
                                user={user}
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

export default UserTable;
