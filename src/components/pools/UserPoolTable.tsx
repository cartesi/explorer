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
    useBreakpointValue,
} from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';

import UserPoolRow from './UserPoolRow';
import { PoolBalance } from '../../graphql/models';
import { TableResponsiveHolder } from '../TableResponsiveHolder';

export interface UserPoolTableProps {
    chainId: number;
    account?: string;
    walletBalance: BigNumber;
    loading: boolean;
    data?: PoolBalance[];
}

const UserPoolTable: FC<UserPoolTableProps> = ({
    chainId,
    account,
    walletBalance,
    data,
    loading,
}) => {
    const bp = useBreakpointValue([0, 1, 2, 3]);

    // number of columns at each breakpoint
    const columns = useBreakpointValue([3, 3, 4, 8]);

    return (
        <TableResponsiveHolder>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Address</Th>
                        <Th isNumeric>Wallet</Th>
                        <Th hidden={bp < 3} />
                        <Th isNumeric>Unstaked</Th>
                        <Th hidden={bp < 3} />
                        <Th isNumeric>Staked</Th>
                        <Th isNumeric>% Pool</Th>
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
                                account={account}
                            />
                        ))}
                </Tbody>
            </Table>
        </TableResponsiveHolder>
    );
};

export default UserPoolTable;
