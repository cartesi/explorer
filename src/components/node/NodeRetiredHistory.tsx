// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, memo, useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { useUserNodes } from '../../graphql/hooks/useNodes';
export interface INodeRetiredHistory {
    address: string;
}
interface HistoryProps {
    index: number;
    address: string;
    retirementTimestamp: number;
}

const History: FC<HistoryProps> = memo(
    ({ index, address, retirementTimestamp }) => {
        const formattedTime = new Date(
            retirementTimestamp * 1000
        ).toUTCString();
        return (
            <Tr borderBottom="1px solid #E3E3E5" key={index}>
                <Td>{address}</Td>
                <Td>{formattedTime}</Td>
            </Tr>
        );
    }
);
export const NodeRetiredHistory: FC<INodeRetiredHistory> = ({ address }) => {
    const [list, updateList] = useState(null);
    const { data, loading } = useUserNodes(
        address,
        3,
        {
            where: { status: 'Retired' },
        },
        'retirementTimestamp'
    );
    useEffect(() => {
        if (data) {
            updateList(data?.nodes);
        }
    }, [loading]);
    return (
        <Box mt={8} mb={10}>
            <Accordion allowToggle>
                <AccordionItem border="none">
                    <AccordionButton
                        borderTop="none"
                        borderBottom="none"
                        borderLeft="1px solid #000"
                        paddingX="1rem"
                        minH="2rem"
                    >
                        <Flex alignItems="center" columnGap={4}>
                            <Text fontSize="xl">Node History</Text>
                            <AccordionIcon />
                        </Flex>
                    </AccordionButton>
                    <AccordionPanel px={0}>
                        <TableContainer>
                            <Table variant="unstyled" color="gray.400">
                                <Thead borderBottom="1px solid #E3E3E5">
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
                                    {list &&
                                        list.length > 0 &&
                                        list.map((history, index) => (
                                            <History
                                                key={index}
                                                index={index}
                                                address={history.id}
                                                retirementTimestamp={
                                                    history.retirementTimestamp
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
