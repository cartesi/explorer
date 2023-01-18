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
} from '@chakra-ui/react';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { User, UserSort } from '../../graphql/models';
import { TableResponsiveHolder } from '../TableResponsiveHolder';
import UserRow from './UserRow';
import { GhostButton } from '@explorer/ui';

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

    return (
        <TableResponsiveHolder>
            <Table>
                <Thead>
                    <Tr>
                        <Th>User</Th>

                        <Th isNumeric>
                            <GhostButton
                                fontSize="xs"
                                fontWeight="bold"
                                _hover={{ color: 'blue.400' }}
                                onClick={() => onSort('totalBlocks')}
                            >
                                Block Produced
                            </GhostButton>
                            {sort == 'totalBlocks' && <ArrowDownIcon />}
                        </Th>

                        <Th isNumeric>
                            <GhostButton
                                fontSize="xs"
                                fontWeight="bold"
                                _hover={{ color: 'blue.400' }}
                                onClick={() => onSort('balance')}
                            >
                                Total Staked
                            </GhostButton>
                            {sort == 'balance' && <ArrowDownIcon />}
                        </Th>

                        <Th isNumeric>
                            <GhostButton
                                fontSize="xs"
                                fontWeight="bold"
                                _hover={{ color: 'blue.400' }}
                                onClick={() => onSort('totalReward')}
                            >
                                Total Rewards
                            </GhostButton>
                            {sort == 'totalReward' && <ArrowDownIcon />}
                        </Th>

                        <Th
                            isNumeric
                            position={{ base: 'sticky', md: 'initial' }}
                            top={0}
                            right={0}
                            style={{ textAlign: 'center' }}
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
