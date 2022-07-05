import {
    Box,
    Table,
    useColorModeValue,
    Thead,
    Th,
    Tr,
    Tbody,
    Td,
} from '@chakra-ui/react';
import { memo } from 'react';
import Address from '../../components/Address';
import { PencilIcon } from '../../components/Icons';
import { TableResponsiveHolder } from '../../components/TableResponsiveHolder';
import { formatValue } from '../../utils/numberFormatter';
const commonProps = {
    whiteSpace: 'nowrap',
};
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
                                Total Users
                            </Th>
                            <Th isNumeric whiteSpace="nowrap">
                                Total Rewards
                            </Th>
                            <Th isNumeric whiteSpace="nowrap">
                                Commission
                            </Th>
                            <Th isNumeric whiteSpace="nowrap">
                                Pool Balance
                            </Th>
                            <Th whiteSpace="nowrap">Node Status</Th>
                            <Th isNumeric whiteSpace="nowrap">
                                Block Produced
                            </Th>
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
                                    chainId={3}
                                    hideActions
                                    noActions
                                ></Address>
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
                            <Td isNumeric>132</Td>
                            <Td isNumeric>
                                {formatValue('0', 'ctsi', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                })}
                            </Td>
                            <Td isNumeric>2.3987 %</Td>
                            <Td isNumeric>
                                {formatValue(
                                    '117350000000000000000000',
                                    'ctsi',
                                    {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                    }
                                )}
                            </Td>
                            <Td>Hired</Td>
                            <Td isNumeric>257</Td>
                            <Td
                                position="sticky"
                                right="0"
                                zIndex={20}
                                bg={bg}
                                textAlign="center"
                            >
                                <PencilIcon fill="white" />
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableResponsiveHolder>
        </Box>
    );
};

export default memo(PoolTableInfo);
