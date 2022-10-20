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
} from '@chakra-ui/react';
import { TableResponsiveHolder } from '../../TableResponsiveHolder';
import PoolCommissionsTableRow from './PoolCommissionsTableRow';
import { StakingPoolFeeHistory } from '../../../graphql/models';

export interface PoolCommissionsTableProps {
    loading: boolean;
    data?: StakingPoolFeeHistory[];
}

const PoolCommissionsTable: FC<PoolCommissionsTableProps> = ({
    data,
    loading,
}) => {
    const hasItems = data?.length > 0;

    return (
        <TableResponsiveHolder>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Date</Th>
                        <Th isNumeric>Commission</Th>
                        <Th isNumeric>Change</Th>
                    </Tr>
                </Thead>

                <Tbody>
                    {loading ? (
                        <Tr>
                            <Td colSpan={9} textAlign="center">
                                <HStack justify="center">
                                    <Spinner />
                                    <Text>Loading</Text>
                                </HStack>
                            </Td>
                        </Tr>
                    ) : hasItems ? (
                        data.map((item) => (
                            <PoolCommissionsTableRow
                                key={item.id}
                                data={item}
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

export default PoolCommissionsTable;
