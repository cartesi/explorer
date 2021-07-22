// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
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
} from '@chakra-ui/react';
import { ArrowDownIcon } from '@chakra-ui/icons';

import { User } from '../../graphql/models';
import UserRow from './UserRow';

export type Sort = 'stakedBalance' | 'totalReward' | 'totalBlocks';

export interface UserTableProps {
    account?: string;
    loading: boolean;
    data?: User[];
    sort?: Sort;
    onSort: (order: Sort) => void;
}

const UserTable: FunctionComponent<UserTableProps> = ({
    account,
    data,
    loading,
    sort,
    onSort,
}) => {
    return (
        <Table w="100%" variant="simple" size="sm">
            <Thead>
                <Tr>
                    <Th>User</Th>
                    <Th onClick={() => onSort('totalBlocks')} isNumeric>
                        #Blocks Produced{' '}
                        {sort == 'totalBlocks' && <ArrowDownIcon />}
                    </Th>
                    <Th onClick={() => onSort('stakedBalance')} isNumeric>
                        Total Staked{' '}
                        {sort == 'stakedBalance' && <ArrowDownIcon />}
                    </Th>
                    <Th onClick={() => onSort('totalReward')} isNumeric>
                        Total Rewards{' '}
                        {sort == 'totalReward' && <ArrowDownIcon />}
                    </Th>
                    <Th></Th>
                </Tr>
            </Thead>

            <Tbody>
                {loading && (
                    <Tr>
                        <Td colSpan={5} textAlign="center">
                            <HStack justify="center">
                                <Spinner />
                                <Text>Loading</Text>
                            </HStack>
                        </Td>
                    </Tr>
                )}
                {!data ||
                    (data.length === 0 && (
                        <Tr>
                            <Td colSpan={5} textAlign="center">
                                <Text>No items</Text>
                            </Td>
                        </Tr>
                    ))}
                {!loading &&
                    data &&
                    data.length > 0 &&
                    data.map((user) => (
                        <UserRow key={user.id} user={user} account={account} />
                    ))}
            </Tbody>
        </Table>
    );
};

export default UserTable;
