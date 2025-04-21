// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Accordion,
    Box,
    Flex,
    Table,
    Text,
    useMediaQuery,
} from '@chakra-ui/react';
import { FC, memo } from 'react';
import { useUserNodes } from '../../graphql/hooks/useNodes';
import { truncateString } from '../../utils/stringUtils';
import { useColorModeValue } from '../ui/color-mode';

export interface NodeRetiredHistoryProps {
    address: string;
}
interface HistoryProps {
    address: string;
    retirementTimestamp: number;
}

const History: FC<HistoryProps> = memo(
    ({ address, retirementTimestamp, ...restProps }) => {
        const [isLargerThan554] = useMediaQuery(['(min-width: 555px)']);
        const formattedTime = new Date(
            retirementTimestamp * 1000
        ).toUTCString();
        const formattedAddress = isLargerThan554
            ? address
            : truncateString(address);
        return (
            <Table.Row
                borderBottomWidth="1px"
                borderBottomColor="gray.200"
                borderBottomStyle="solid"
                {...restProps}
            >
                <Table.Cell>{formattedAddress}</Table.Cell>
                <Table.Cell>{formattedTime}</Table.Cell>
            </Table.Row>
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
            <Accordion.Root collapsible>
                <Accordion.Item border="none" value="">
                    <Accordion.ItemTrigger
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
                            <Accordion.ItemIndicator />
                        </Flex>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent px={0}>
                        <Accordion.ItemBody>
                            <Table.ScrollArea>
                                <Table.Root
                                    variant="unstyled"
                                    color={textColor}
                                >
                                    <Table.Header
                                        borderBottomWidth="1px"
                                        borderBottomColor="gray.200"
                                        borderBottomStyle="solid"
                                    >
                                        <Table.Row>
                                            <Table.Cell>
                                                <Text
                                                    fontSize="md"
                                                    textTransform="capitalize"
                                                >
                                                    Node Address
                                                </Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text
                                                    fontSize="md"
                                                    textTransform="capitalize"
                                                >
                                                    Retire date (GMT)
                                                </Text>
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body fontSize="md">
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
                                    </Table.Body>
                                </Table.Root>
                            </Table.ScrollArea>
                        </Accordion.ItemBody>
                    </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>
        </Box>
    );
};
