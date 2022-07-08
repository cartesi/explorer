// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Table,
    useColorModeValue,
    Thead,
    Th,
    Tr,
    Tbody,
    Td,
    Text,
} from '@chakra-ui/react';
import Address from './Address';
import { PencilIcon } from '../../../components/Icons';
import { TableResponsiveHolder } from '../../../components/TableResponsiveHolder';
import { formatValue } from '../../../utils/numberFormatter';

const PoolTableInfo = () => {
    const bg = useColorModeValue('white', 'gray.800');
    return (
        <Box maxHeight="30vh" overflowY="auto">
            <TableResponsiveHolder>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Node Address</Th>
                            <Th isNumeric whiteSpace="nowrap">
                                Total Staked
                            </Th>
                            <Th isNumeric whiteSpace="nowrap">
                                Total Rewards
                            </Th>
                            <Th isNumeric>
                                <Text whiteSpace="nowrap">30-Days Yield</Text>
                                (ANNUAL)
                            </Th>
                            <Th isNumeric whiteSpace="nowrap">
                                Block Produced
                            </Th>
                            <Th whiteSpace="nowrap">Node Status</Th>
                            <Th position="sticky" right="0" zIndex={20}>
                                Manage
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>
                                <Address
                                    address="0xe584cd6dD071f532e9598e96589663E69330731B"
                                    truncated
                                />
                            </Td>
                            <Td isNumeric>
                                {' '}
                                {formatValue(
                                    '118350000000000000000000',
                                    'ctsi',
                                    {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                    }
                                )}
                            </Td>
                            <Td isNumeric>
                                {formatValue('0', 'ctsi', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                })}
                            </Td>
                            <Td isNumeric>
                                3% <Text whiteSpace={'nowrap'}>(2.318 %)</Text>
                            </Td>
                            <Td isNumeric>257</Td>
                            <Td>Hired</Td>
                            <Td
                                position="sticky"
                                right="0"
                                zIndex={20}
                                bg={bg}
                                textAlign="center"
                            >
                                <PencilIcon color="white" />
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableResponsiveHolder>
        </Box>
    );
};

export default PoolTableInfo;
