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
    Link,
} from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';

import UserPoolRow from './UserPoolRow';
import { PoolBalance } from '../../graphql/models';

export interface UserPoolTableProps {
    chainId: number;
    account?: string;
    walletBalance: BigNumber;
    loading: boolean;
    data?: PoolBalance[];
    size?: 'lg' | 'md' | 'sm';
}

const UserPoolTable: FC<UserPoolTableProps> = ({
    chainId,
    account,
    walletBalance,
    data,
    loading,
    size = 'lg',
}) => {
    const sizes = {
        lg: 5,
        md: 4,
        sm: 2,
    };
    const columns = sizes[size] || 6;
    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>Address</Th>
                    <Th isNumeric>
                        <Link>Wallet</Link>
                    </Th>
                    <Th isNumeric></Th>
                    <Th isNumeric>
                        <Link>Unstaked</Link>
                    </Th>
                    <Th isNumeric></Th>
                    <Th isNumeric>
                        <Link>Staked</Link>
                    </Th>
                    {size == 'lg' && <Th isNumeric>% Pool</Th>}
                    <Th textAlign="right">Action</Th>
                </Tr>
            </Thead>

            <Tbody>
                {loading && (
                    <Tr>
                        <Td colSpan={columns} textAlign="center">
                            <HStack justify="center">
                                <Spinner />
                                <Text>Loading</Text>
                            </HStack>
                        </Td>
                    </Tr>
                )}
                {!loading &&
                    (!data ||
                        (data.length === 0 && (
                            <Tr>
                                <Td colSpan={columns} textAlign="center">
                                    <Text>No items</Text>
                                </Td>
                            </Tr>
                        )))}
                {!loading &&
                    data &&
                    data.length > 0 &&
                    data.map((balance) => (
                        <UserPoolRow
                            key={balance.pool.id}
                            chainId={chainId}
                            walletBalance={walletBalance}
                            balance={balance}
                            size={size}
                            account={account}
                        />
                    ))}
            </Tbody>
        </Table>
    );
};

export default UserPoolTable;
