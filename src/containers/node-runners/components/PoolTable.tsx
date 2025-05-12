// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FaArrowDown } from 'react-icons/fa';
import {
    Box,
    BoxProps,
    Button,
    ButtonProps,
    Flex,
    Heading,
    HStack,
    Icon,
    Spinner,
    Stack,
    Table,
    TableColumnHeaderProps,
    Text,
    useDisclosure,
    VisuallyHidden,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import NextLink from 'next/link';
import { useEffect } from 'react';
import Address from '../../../components/Address';
import { GhostButton } from '../../../components/GhostButton';
import { PencilIcon } from '../../../components/Icons';
import { Notification } from '../../../components/Notification';
import { OrderedContent } from '../../../components/OrderedContent';
import { TableResponsiveHolder } from '../../../components/TableResponsiveHolder';
import { useWallet } from '../../../components/wallet';
import { useUserNodes } from '../../../graphql/hooks/useNodes';
import useFlag from '../../../hooks/useFlag';
import { useCartesiToken } from '../../../services/token';
import theme from '../../../styles/theme';
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
import { useColorModeValue } from '../../../components/ui/color-mode';

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
    const buttonHoverColor = useColorModeValue('gray.90', 'dark.gray.quinary');
    const buttonProps: ButtonProps = {
        height: 'auto',
        fontSize: 'md',
        fontWeight: 400,
        fontFamily: theme.tokens.getVar('fonts.body'),
        textTransform: 'none',
        _hover: {
            color: buttonHoverColor,
        },
    };
    const borderColor = useColorModeValue(
        'transparent',
        'dark.gray.quaternary'
    );
    const topBorderColor = useColorModeValue(
        'transparent',
        'dark.gray.quinary'
    );

    const thProps: TableColumnHeaderProps = {
        borderColor: topBorderColor,
        color: 'white',
        bg: 'dark.gray.primary',
        textTransform: 'none',
        fontSize: 'md',
        fontWeight: 400,
        fontFamily: theme.tokens.getVar('fonts.body'),
        paddingTop: 4,
        paddingBottom: 4,
    };
    const addressColor = useColorModeValue('gray.900', 'white');
    const backgroundHoverColor = useColorModeValue(
        'WhiteSmoke',
        'dark.gray.tertiary'
    );
    const linkHoverColor = useColorModeValue('blue.400', 'dark.primary');
    const linkColor = useColorModeValue('gray.900', 'gray.90');
    const { chainId } = useWallet();

    return (
        <TableResponsiveHolder
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="6px"
        >
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Cell {...thProps} role="columnheader">
                            Address
                        </Table.Cell>
                        <Table.Cell
                            whiteSpace="nowrap"
                            textAlign="right"
                            {...thProps}
                        >
                            <Flex alignItems="center">
                                <GhostButton
                                    {...buttonProps}
                                    onClick={() => setSortBy('amount')}
                                >
                                    Total Staked
                                </GhostButton>
                                {sortBy == 'amount' && (
                                    <Icon as={FaArrowDown} ml={1} />
                                )}
                            </Flex>
                        </Table.Cell>
                        <Table.Cell
                            whiteSpace="nowrap"
                            textAlign="right"
                            {...thProps}
                        >
                            <Flex alignItems="center">
                                <GhostButton
                                    {...buttonProps}
                                    onClick={() => setSortBy('totalUsers')}
                                >
                                    Total Users
                                </GhostButton>
                                {sortBy == 'totalUsers' && (
                                    <Icon as={FaArrowDown} ml={1} />
                                )}
                            </Flex>
                        </Table.Cell>
                        <Table.Cell
                            whiteSpace="nowrap"
                            textAlign="right"
                            {...thProps}
                        >
                            Total Rewards
                        </Table.Cell>
                        <Table.Cell
                            whiteSpace="nowrap"
                            textAlign="right"
                            {...thProps}
                        >
                            <Flex alignItems="center">
                                <GhostButton
                                    {...buttonProps}
                                    onClick={() =>
                                        setSortBy('commissionPercentage')
                                    }
                                >
                                    Commission
                                </GhostButton>
                                {sortBy == 'commissionPercentage' && (
                                    <Icon as={FaArrowDown} ml={1} />
                                )}
                            </Flex>
                        </Table.Cell>
                        <Table.Cell
                            whiteSpace="nowrap"
                            textAlign="right"
                            {...thProps}
                        >
                            Pool Balance
                        </Table.Cell>
                        <Table.Cell whiteSpace="nowrap" {...thProps}>
                            Node Status
                        </Table.Cell>
                        <Table.Cell
                            whiteSpace="nowrap"
                            textAlign="right"
                            {...thProps}
                        >
                            Block Produced
                        </Table.Cell>
                        <Table.Cell position="sticky" right="0" {...thProps}>
                            Manage
                        </Table.Cell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {loading && (
                        <Table.Row>
                            <Table.Cell colSpan={9}>
                                <HStack justify="center">
                                    <Spinner />
                                    <Text>Loading</Text>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    )}
                    {!loading &&
                        data.map((pool) => (
                            <Table.Row key={pool.id}>
                                <Table.Cell>
                                    <Address
                                        ens
                                        chainId={chainId}
                                        address={pool.id}
                                        truncated
                                        minWidth="120px"
                                        textDecoration="underline"
                                        px="0.5rem"
                                        py="0.25rem"
                                        color={addressColor}
                                        shouldDisplayFallbackAvatar
                                        renderLabel={(label) => (
                                            <Button
                                                asChild
                                                variant="text"
                                                px={0}
                                                title="Pool info"
                                            >
                                                <NextLink
                                                    href={`/stake/${pool.id}`}
                                                >
                                                    {label}
                                                </NextLink>
                                            </Button>
                                        )}
                                    />
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    {pool.totalStaked}
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    {pool.totalUsers}
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    {pool.totalRewards}
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    {pool.commission}
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    <PoolBalance address={pool.id} />
                                </Table.Cell>
                                <Table.Cell>
                                    <NodeStatus ownerAddress={pool.id} />
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    {pool.blocksProduced}
                                </Table.Cell>
                                <Table.Cell
                                    position="sticky"
                                    right="0"
                                    textAlign="center"
                                    backgroundColor={backgroundHoverColor}
                                >
                                    <Button
                                        asChild
                                        variant="link"
                                        color={linkColor}
                                        _hover={{
                                            color: linkHoverColor,
                                        }}
                                    >
                                        <NextLink
                                            href={`/pools/${pool.id}/manage?from=node-runners`}
                                        >
                                            <VisuallyHidden>
                                                Manage pool {pool.id}
                                            </VisuallyHidden>
                                            <PencilIcon
                                                data-testid={`pencil-svg-${pool.id}`}
                                            />
                                        </NextLink>
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                </Table.Body>
            </Table.Root>
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
    const { open, onOpen, onClose } = useDisclosure({
        defaultOpen: showAlert,
    });

    const notificationTitle = useMessages('pos.v2');
    const updateTitle = useMessages('pool.update.pos.steps.title');
    const updateSteps = [
        useMessages('pool.update.pos.steps.one'),
        useMessages('pool.update.pos.steps.two'),
        useMessages('pool.update.pos.steps.three'),
        useMessages('pool.update.pos.steps.four'),
    ];
    const colorScheme = useColorModeValue('teal', 'cyan');

    useEffect(() => {
        showAlert ? onOpen() : onClose();
    }, [showAlert, onOpen, onClose]);

    return (
        pools?.length > 0 && (
            <Block bg={bg} {...boxProps}>
                <Box>
                    {open && (
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
                        lineHeight="1.5rem"
                    >
                        Pool Management
                    </Heading>
                    <Button asChild colorPalette={colorScheme}>
                        <NextLink href="/pools/new">CREATE A POOL</NextLink>
                    </Button>
                </Stack>
                <PoolTable data={pools} />
            </Block>
        )
    );
};

export default PoolTableBlock;
