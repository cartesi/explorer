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
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
// import Address from '../../components/Address';
import { PencilIcon } from '../../components/Icons';
import { TableResponsiveHolder } from '../../components/TableResponsiveHolder';
import { useCartesiToken } from '../../services/token';
import { formatCTSI } from '../../utils/token';
import { PoolInfo } from './interfaces';
import Address from './Address';
import useNodes, { useUserNodes } from '../../graphql/hooks/useNodes';

interface Props {
    data: PoolInfo[];
}

type PoolTableInfoProps = {
    pools?: PoolInfo[];
};

type CommonProps = { address: string };

const PoolBalance = ({ address }: CommonProps) => {
    const { balance } = useCartesiToken(address);
    return <Td isNumeric>{formatCTSI(balance, 2)}</Td>;
};

const NodeStatus = ({ address }: CommonProps) => {
    const { loading, data } = useUserNodes(address, 1);
    const label = data?.nodes?.length > 0 ? 'Hired' : 'Not Hired';

    if (loading)
        return (
            <Td textAlign="center">
                <HStack>
                    <Spinner />
                    <Text>Loading</Text>
                </HStack>
            </Td>
        );

    return <Td>{label}</Td>;
};

const PoolTable = ({ data }: Props) => {
    const bg = useColorModeValue('white', 'gray.800');
    console.log(data);
    return (
        <Box maxHeight={{ base: '30vh', md: '35vh' }} overflowY="auto">
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
                        {data.map((pool) => (
                            <Tr key={pool.id}>
                                <Td>
                                    <Address
                                        address={pool.id}
                                        truncated
                                    ></Address>
                                </Td>
                                <Td isNumeric>{pool.totalStaked}</Td>
                                <Td isNumeric>{pool.totalUsers}</Td>
                                <Td isNumeric>{pool.totalRewards}</Td>
                                <Td isNumeric>{pool.commission}</Td>
                                <PoolBalance address={pool.id} />
                                <NodeStatus address={pool.id} />
                                <Td isNumeric>{pool.blocksProduced}</Td>
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
                        ))}
                    </Tbody>
                </Table>
            </TableResponsiveHolder>
        </Box>
    );
};

const PoolTableInfo = ({ pools }: PoolTableInfoProps) => {
    return pools?.length > 0 ? (
        <>
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
                <NextLink href="/pools/new">
                    <Button colorScheme="blue">CREATE A POOL</Button>
                </NextLink>
            </Stack>
            <PoolTable data={pools} />
        </>
    ) : null;
};

export default memo(PoolTableInfo);
