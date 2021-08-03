// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
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
import PoolRow from './PoolRow';
import { StakingPool, StakingPoolSort } from '../../graphql/models';
import { ArrowDownIcon } from '@chakra-ui/icons';

export interface PoolTableProps {
    chainId: number;
    account?: string;
    loading: boolean;
    data?: StakingPool[];
    size?: 'lg' | 'md' | 'sm';
    sort?: StakingPoolSort;
    onSort: (order: StakingPoolSort) => void;
}

const PoolTable: FunctionComponent<PoolTableProps> = ({
    chainId,
    account,
    data,
    loading,
    size = 'lg',
    sort,
    onSort,
}) => {
    let columns = 6;
    switch (size) {
        case 'lg':
            columns = 6;
            break;
        case 'md':
            columns = 5;
            break;
        case 'sm':
            columns = 3;
            break;
    }

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>Address</Th>
                    {(size == 'lg' || size == 'md') && (
                        <Th isNumeric>
                            <Link onClick={() => onSort('totalUsers')}>
                                Total Users
                            </Link>
                            {sort == 'totalUsers' && <ArrowDownIcon />}
                        </Th>
                    )}
                    <Th isNumeric>
                        <Link onClick={() => onSort('amount')}>
                            Total Staked
                        </Link>{' '}
                        {sort == 'amount' && <ArrowDownIcon />}
                    </Th>
                    {size == 'lg' && <Th isNumeric>Total Rewards</Th>}
                    {size == 'lg' && <Th>Commission</Th>}
                    {(size == 'lg' || size == 'md') && (
                        <Th>
                            <Link onClick={() => onSort('totalCommission')}>
                                Accrued Commission
                            </Link>{' '}
                            {sort == 'totalCommission' && <ArrowDownIcon />}
                        </Th>
                    )}
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
                    data.map((pool) => (
                        <PoolRow
                            key={pool.id}
                            chainId={chainId}
                            pool={pool}
                            size={size}
                            account={account}
                        />
                    ))}
            </Tbody>
        </Table>
    );
};

export default PoolTable;