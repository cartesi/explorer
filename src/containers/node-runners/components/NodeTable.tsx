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
    BoxProps,
    Stack,
    Heading,
    HStack,
    Spinner,
    Button,
    VisuallyHidden,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import Address from '../../../components/Address';
import { TableResponsiveHolder } from '../../../components/TableResponsiveHolder';
import {
    PencilIcon,
    StakeCircledOutlinedIcon,
} from '../../../components/Icons';
import Block from './Block';
import { useAtom } from 'jotai';
import { hasPrivateNodeAtom, nodeInfoDataAtom } from '../atoms';

interface TableInfo {
    boxProps?: BoxProps;
}

const useStyle = () => {
    const bg = useColorModeValue('white', 'gray.800');
    return [bg];
};

const NodeTable = () => {
    const [bg] = useStyle();
    const [data] = useAtom(nodeInfoDataAtom);
    const { list, loading } = data;
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
                            <Th isNumeric whiteSpace="nowrap">
                                Block Produced
                            </Th>
                            <Th whiteSpace="nowrap">Node Status</Th>
                            <Th position="sticky" right="0">
                                Manage
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {loading && (
                            <Tr>
                                <Td colSpan={6}>
                                    <HStack justify="center">
                                        <Spinner />
                                        <Text>Loading</Text>
                                    </HStack>
                                </Td>
                            </Tr>
                        )}
                        {!loading &&
                            list.map((node) => (
                                <Tr key={node.id}>
                                    <Td>
                                        <Address
                                            address={node.id}
                                            truncated
                                            shouldDisplayFallbackAvatar
                                            fallbackAvatar={
                                                StakeCircledOutlinedIcon
                                            }
                                        />
                                    </Td>
                                    <Td isNumeric>{node.totalStaked}</Td>
                                    <Td isNumeric>{node.totalRewards}</Td>
                                    <Td isNumeric>{node.blocksProduced}</Td>
                                    <Td>{node.nodeStatus}</Td>
                                    <Td
                                        position="sticky"
                                        right="0"
                                        bg={bg}
                                        textAlign="center"
                                    >
                                        <NextLink
                                            href={`/node/${node.id}/manage`}
                                            passHref
                                        >
                                            <Button as="a" variant="link">
                                                <VisuallyHidden>
                                                    Manage node {node.id}
                                                </VisuallyHidden>
                                                <PencilIcon
                                                    color="white"
                                                    data-testid={`pencil-svg-${node.id}`}
                                                />
                                            </Button>
                                        </NextLink>
                                    </Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableResponsiveHolder>
        </Box>
    );
};

const NodeTableBlock = ({ boxProps }: TableInfo) => {
    const [bg] = useStyle();
    const [hasPrivateNode] = useAtom(hasPrivateNodeAtom);

    return (
        hasPrivateNode && (
            <Block bg={bg} {...boxProps}>
                <Stack justify="space-between" direction={'row'}>
                    <Heading
                        fontSize="2xl"
                        mt={5}
                        mb={{ base: 4, md: 8 }}
                        fontWeight="medium"
                        lineHeight={6}
                    >
                        Private Node Management
                    </Heading>
                </Stack>
                <NodeTable />
            </Block>
        )
    );
};

export default NodeTableBlock;
