// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, memo } from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Flex,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    useMediaQuery,
    useColorModeValue,
} from '@chakra-ui/react';
import { useUserNodes } from '../../graphql/hooks/useNodes';
import { truncateString } from '../../utils/stringUtils';
export interface NodeRetiredHistoryProps {
    address: string;
}
interface HistoryProps {
    address: string;
    retirementTimestamp: number;
}

const History: FC<HistoryProps> = memo(
    ({ address, retirementTimestamp, ...restProps }) => {
        const [isLargerThan554] = useMediaQuery('(min-width: 555px)');
        const formattedTime = new Date(
            retirementTimestamp * 1000
        ).toUTCString();
        const formattedAddress = isLargerThan554
            ? address
            : truncateString(address);
        return (
            <Tr
                borderBottomWidth="1px"
                borderBottomColor="gray.200"
                borderBottomStyle="solid"
                {...restProps}
            >
                <Td>{formattedAddress}</Td>
                <Td>{formattedTime}</Td>
            </Tr>
        );
    }
);
export const NodeRetiredHistory: FC<NodeRetiredHistoryProps> = ({
    address,
}) => {
    const textColor = useColorModeValue('gray.400', 'white');
    const borderColor = useColorModeValue('black', 'white');
    const { data } = useUserNodes(
        address,
        3,
        {
            where: { status: 'Retired' },
        },
        'retirementTimestamp'
    );
    return (
        <Box mt={8} mb={10}>
            <Accordion allowToggle>
                <AccordionItem border="none">
                    <AccordionButton
                        borderTop="none"
                        borderBottom="none"
                        borderLeftWidth="1px"
                        borderLeftColor={borderColor}
                        borderLeftStyle="solid"
                        paddingX={4}
                        minH={8}
                    >
                        <Flex alignItems="center" columnGap={4}>
                            <Text fontSize="xl">Node History</Text>
                            <AccordionIcon />
                        </Flex>
                    </AccordionButton>
                    <AccordionPanel px={0}>
                        <TableContainer>
                            <Table variant="unstyled" color={textColor}>
                                <Thead
                                    borderBottomWidth="1px"
                                    borderBottomColor="gray.200"
                                    borderBottomStyle="solid"
                                >
                                    <Tr>
                                        <Th>
                                            <Text
                                                fontSize="md"
                                                textTransform="capitalize"
                                            >
                                                Node Address
                                            </Text>
                                        </Th>
                                        <Th>
                                            <Text
                                                fontSize="md"
                                                textTransform="capitalize"
                                            >
                                                Retire date (GMT)
                                            </Text>
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody fontSize="md">
                                    {data?.nodes &&
                                        data?.nodes.length > 0 &&
                                        data.nodes.map((node) => (
                                            <History
                                                key={node.id}
                                                address={node.id}
                                                retirementTimestamp={
                                                    node.retirementTimestamp
                                                }
                                            />
                                        ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </Box>
    );
};
