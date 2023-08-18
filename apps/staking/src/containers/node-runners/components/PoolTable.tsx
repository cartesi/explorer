// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { ArrowDownIcon } from '@chakra-ui/icons';
import {
    Box,
    BoxProps,
    Button,
    Heading,
    HStack,
    Spinner,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useDisclosure,
    VisuallyHidden,
} from '@chakra-ui/react';
import { Address, GhostButton, Notification, PencilIcon } from '@explorer/ui';
import { useFlag } from '@unleash/proxy-client-react';
import { useAtom } from 'jotai';
import NextLink from 'next/link';
import { useEffect } from 'react';
import { OrderedContent } from '../../../components/OrderedContent';
import { TableResponsiveHolder } from '../../../components/TableResponsiveHolder';
import { useUserNodes } from '../../../graphql/hooks/useNodes';
import { useCartesiToken } from '../../../services/token';
import { useMessages } from '../../../utils/messages';
import { formatCTSI } from '../../../utils/token';
import {
    poolDataFetchingAtom,
    poolInfoListAtom,
    poolSortByAtom,
} from '../atoms';
import { PoolInfo } from '../interfaces';
import Block from './Block';
import useDontShowAgain from './useDontShowAgain';

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

    return (
        <TableResponsiveHolder>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Address</Th>
                        <Th isNumeric whiteSpace="nowrap">
                            <GhostButton
                                height="auto"
                                fontSize="xs"
                                fontWeight="bold"
                                _hover={{ color: 'blue.400' }}
                                onClick={() => setSortBy('amount')}
                            >
                                Total Staked
                            </GhostButton>
                            {sortBy == 'amount' && <ArrowDownIcon />}
                        </Th>
                        <Th isNumeric whiteSpace="nowrap">
                            <GhostButton
                                height="auto"
                                fontSize="xs"
                                fontWeight="bold"
                                _hover={{ color: 'blue.400' }}
                                onClick={() => setSortBy('totalUsers')}
                            >
                                Total Users
                            </GhostButton>
                            {sortBy == 'totalUsers' && <ArrowDownIcon />}
                        </Th>
                        <Th isNumeric whiteSpace="nowrap">
                            Total Rewards
                        </Th>
                        <Th isNumeric whiteSpace="nowrap">
                            <GhostButton
                                height="auto"
                                fontSize="xs"
                                fontWeight="bold"
                                _hover={{ color: 'blue.400' }}
                                onClick={() =>
                                    setSortBy('commissionPercentage')
                                }
                            >
                                Commission
                            </GhostButton>
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
                        <Th
                            position="sticky"
                            right="0"
                            bg={'dark.gray.quaternary'}
                        >
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
                                        size="md"
                                        bg="blue.50"
                                        px="0.5rem"
                                        py="0.25rem"
                                        color="gray.900"
                                        minWidth="120px"
                                        shouldDisplayFallbackAvatar
                                        renderLabel={(label) => (
                                            <NextLink
                                                href={`/stake/${pool.id}`}
                                                passHref
                                            >
                                                <Button
                                                    as="a"
                                                    variant="text"
                                                    px={0}
                                                    title="Pool info"
                                                >
                                                    {label}
                                                </Button>
                                            </NextLink>
                                        )}
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
                                    bg={'dark.gray.quaternary'}
                                    textAlign="center"
                                >
                                    <NextLink
                                        href={`/pools/${pool.id}/manage?from=node-runners`}
                                        passHref
                                    >
                                        <Button as="a" variant="link">
                                            <VisuallyHidden>
                                                Manage pool {pool.id}
                                            </VisuallyHidden>
                                            <PencilIcon
                                                color={'white'}
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
    );
};
interface PoolTableInfoProps {
    boxProps?: BoxProps;
}

const SHOW_POS_V2_ALERT = 'showPoSV2AlertForStakingPool';
const PoolTableBlock = ({ boxProps }: PoolTableInfoProps) => {
    const bg = useColorModeValue('white', 'dark.gray.primary');
    const [pools] = useAtom(poolInfoListAtom);

    const posV2Enabled = useFlag('posV2Enabled');
    const { value, handleDontShowAgain } = useDontShowAgain(SHOW_POS_V2_ALERT);
    const showAlert = posV2Enabled && value;
    const { isOpen, onClose, onOpen } = useDisclosure({
        defaultIsOpen: showAlert,
    });

    const notificationTitle = useMessages('pos.v2');
    const updateTitle = useMessages('pool.update.pos.steps.title');
    const updateSteps = [
        useMessages('pool.update.pos.steps.one'),
        useMessages('pool.update.pos.steps.two'),
        useMessages('pool.update.pos.steps.three'),
        useMessages('pool.update.pos.steps.four'),
    ];

    useEffect(() => {
        showAlert ? onOpen() : onClose();
    }, [showAlert, onClose, onOpen]);

    return (
        pools?.length > 0 && (
            <Block bg={bg} {...boxProps}>
                <Box>
                    {isOpen && (
                        <Notification
                            data-testid="bannerPoolPoSV2"
                            status="warning"
                            title={notificationTitle}
                            subtitle={
                                <OrderedContent
                                    orderedItems={updateSteps}
                                    title={updateTitle}
                                    stackProps={{ px: 0, py: 3 }}
                                />
                            }
                            onClose={() => onClose()}
                        >
                            <Button
                                position="absolute"
                                bottom={{ base: 3, md: 5 }}
                                right={5}
                                size="sm"
                                onClick={() => {
                                    onClose();
                                    handleDontShowAgain();
                                }}
                                variant="link"
                            >
                                Don't show again
                            </Button>
                        </Notification>
                    )}
                </Box>
                <Stack
                    justify="space-between"
                    direction={'row'}
                    alignItems={{ base: 'center', md: 'flex-start' }}
                    mt={8}
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
                        <Button as="a" colorScheme="cyan">
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
