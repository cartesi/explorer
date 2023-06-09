// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useRef } from 'react';
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
import { PoolBalance } from '../../../graphql/models';
import { TableResponsiveHolder } from '../../TableResponsiveHolder';
import UserStakingPoolsTableRow from './UserStakingPoolsTableRow';
import { useVisibilityThreshold } from '../../../utils/hooks/useVisibilityThreshold';
import { SlideInOut } from '../../animation/SlideInOut';

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
    const thRef = useRef<HTMLTableCellElement>();
    const tableRef = useRef<HTMLDivElement>();
    const threshold = useVisibilityThreshold(tableRef.current, thRef.current);

    return (
        <TableResponsiveHolder ref={tableRef}>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Pool Address</Th>
                        <Th isNumeric>Unstaked</Th>
                        <Th isNumeric>Staked</Th>
                        <Th isNumeric>% Pool</Th>
                        <Th isNumeric ref={thRef}>
                            {stakeText}
                        </Th>
                        {threshold.isBelow && (
                            <Th isNumeric position="sticky" top={0} right={0}>
                                <SlideInOut display={true}>
                                    {stakeText}
                                </SlideInOut>
                            </Th>
                        )}
                    </Tr>
                </Thead>

                <Tbody>
                    {loading ? (
                        <Tr>
                            <Td colSpan={columns} textAlign="center">
                                <HStack justify="center">
                                    <Spinner />
                                    <Text>Loading</Text>
                                </HStack>
                            </Td>
                        </Tr>
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
                        <Tr>
                            <Td colSpan={columns} textAlign="center">
                                <Text>No items</Text>
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </TableResponsiveHolder>
    );
};

export default UserStakingPoolsTable;
