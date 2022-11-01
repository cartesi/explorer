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
    Stack,
    Heading,
    Button,
    HStack,
    Spinner,
    Text,
    VisuallyHidden,
    Link,
    BoxProps,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { TableResponsiveHolder } from '../../../components/TableResponsiveHolder';
import { PencilIcon } from '../../../components/Icons';
import { useCartesiToken } from '../../../services/token';
import { formatCTSI } from '../../../utils/token';
import { PoolInfo } from '../interfaces';
import Address from '../../../components/Address';
import { useUserNodes } from '../../../graphql/hooks/useNodes';
import { ArrowDownIcon } from '@chakra-ui/icons';
import {
    poolDataFetchingAtom,
    poolInfoListAtom,
    poolSortByAtom,
} from '../atoms';
import { useAtom } from 'jotai';
import Block from './Block';

interface Props {
    data: PoolInfo[];
}

const PoolBalance = ({ address }: { address: string }) => {
    const { balance } = useCartesiToken(address);
    return <Text>{formatCTSI(balance, 2)}</Text>;
};

const NodeStatus = ({ ownerAddress }: { ownerAddress: string }) => {
    const { loading, data } = useUserNodes(ownerAddress, 1);
    const label = data?.nodes?.length > 0 ? 'Hired' : 'Not Hired';

    if (loading)
        return (
            <HStack>
                <Spinner />
                <Text>Loading</Text>
            </HStack>
        );

    return <Text>{label}</Text>;
};

const PoolTable = ({ data }: Props) => {
    const [sortBy, setSortBy] = useAtom(poolSortByAtom);
    const [loading] = useAtom(poolDataFetchingAtom);
    const bg = useColorModeValue('white', 'gray.800');

    return (
        <Box maxHeight={{ base: '30vh', md: '35vh' }} overflowY="auto">
            <TableResponsiveHolder>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Address</Th>
                            <Th isNumeric whiteSpace="nowrap">
                                <Link onClick={() => setSortBy('amount')}>
                                    Total Staked
                                </Link>
                                {sortBy == 'amount' && <ArrowDownIcon />}
                            </Th>
                            <Th isNumeric whiteSpace="nowrap">
                                <Link onClick={() => setSortBy('totalUsers')}>
                                    Total Users
                                </Link>
                                {sortBy == 'totalUsers' && <ArrowDownIcon />}
                            </Th>
                            <Th isNumeric whiteSpace="nowrap">
                                Total Rewards
                            </Th>
                            <Th isNumeric whiteSpace="nowrap">
                                <Link
                                    onClick={() =>
                                        setSortBy('commissionPercentage')
                                    }
                                >
                                    Commission
                                </Link>
                                {sortBy == 'commissionPercentage' && (
                                    <ArrowDownIcon />
                                )}
                            </Th>
                            <Th isNumeric whiteSpace="nowrap">
                                Pool Balance
                            </Th>
                            <Th whiteSpace="nowrap">Node Status</Th>
                            <Th isNumeric whiteSpace="nowrap">
                                Block Produced
                            </Th>
                            <Th position="sticky" right="0">
                                Manage
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {loading && (
                            <Tr>
                                <Td colSpan={9}>
                                    <HStack justify="center">
                                        <Spinner />
                                        <Text>Loading</Text>
                                    </HStack>
                                </Td>
                            </Tr>
                        )}
                        {!loading &&
                            data.map((pool) => (
                                <Tr key={pool.id}>
                                    <Td>
                                        <Address
                                            ens
                                            address={pool.id}
                                            truncated
                                            borderRadius="full"
                                            size="md"
                                            bg="blue.50"
                                            px="0.5rem"
                                            py="0.25rem"
                                            color="gray.900"
                                            minWidth="120px"
                                            shouldDisplayFallbackAvatar
                                        />
                                    </Td>
                                    <Td isNumeric>{pool.totalStaked}</Td>
                                    <Td isNumeric>{pool.totalUsers}</Td>
                                    <Td isNumeric>{pool.totalRewards}</Td>
                                    <Td isNumeric>{pool.commission}</Td>
                                    <Td isNumeric>
                                        <PoolBalance address={pool.id} />
                                    </Td>
                                    <Td>
                                        <NodeStatus ownerAddress={pool.id} />
                                    </Td>
                                    <Td isNumeric>{pool.blocksProduced}</Td>
                                    <Td
                                        position="sticky"
                                        right="0"
                                        bg={bg}
                                        textAlign="center"
                                    >
                                        <NextLink
                                            href={`/pools/${pool.id}/manage`}
                                            passHref
                                        >
                                            <Button as="a" variant="link">
                                                <VisuallyHidden>
                                                    Manage pool {pool.id}
                                                </VisuallyHidden>
                                                <PencilIcon
                                                    data-testid={`pencil-svg-${pool.id}`}
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
interface PoolTableInfoProps {
    boxProps?: BoxProps;
}

const PoolTableBlock = ({ boxProps }: PoolTableInfoProps) => {
    const bg = useColorModeValue('white', 'gray.800');
    const [pools] = useAtom(poolInfoListAtom);

    return (
        pools?.length > 0 && (
            <Block bg={bg} {...boxProps}>
                <Stack
                    justify="space-between"
                    direction={'row'}
                    alignItems={{ base: 'center', md: 'flex-start' }}
                >
                    <Heading
                        fontSize="2xl"
                        mt={5}
                        mb={{ base: 4, md: 8 }}
                        fontWeight="medium"
                        lineHeight={6}
                    >
                        Pool Management
                    </Heading>
                    <NextLink href="/pools/new" passHref>
                        <Button as="a" colorScheme="blue">
                            CREATE A POOL
                        </Button>
                    </NextLink>
                </Stack>
                <PoolTable data={pools} />
            </Block>
        )
    );
};

export default PoolTableBlock;
