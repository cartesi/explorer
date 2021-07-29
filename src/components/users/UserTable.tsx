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
    Link,
} from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';

import { User, UserSort } from '../../graphql/models';
import UserRow from './UserRow';

export interface UserTableProps {
    chainId: number;
    account?: string;
    loading: boolean;
    data?: User[];
    sort?: UserSort;
    onSort: (order: UserSort) => void;
}

const UserTable: FunctionComponent<UserTableProps> = ({
    chainId,
    account,
    data,
    loading,
    sort,
    onSort,
}) => {
    const header = (title: string, thisSort: UserSort) => (
        <Th isNumeric>
            <Link onClick={() => onSort(thisSort)}>
                <HStack justify="flex-end">
                    <Text>{title}</Text>
                    {sort === thisSort && <TriangleDownIcon />}
                </HStack>
            </Link>
        </Th>
    );

    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th>User</Th>
                    {header('#Blocks Produced', 'totalBlocks')}
                    {header('Total Staked', 'stakedBalance')}
                    {header('Total Rewards', 'totalReward')}
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
                        <UserRow
                            key={user.id}
                            chainId={chainId}
                            user={user}
                            account={account}
                        />
                    ))}
            </Tbody>
        </Table>
    );
};

export default UserTable;
