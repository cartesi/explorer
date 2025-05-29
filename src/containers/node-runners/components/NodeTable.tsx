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
    BoxProps,
    Button,
    Heading,
    HStack,
    IconProps,
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
import { FC, useEffect } from 'react';
import Address from '../../../components/Address';
import {
    PencilIcon,
    StakeCircledOutlinedIcon,
} from '../../../components/Icons';
import { Notification } from '../../../components/Notification';
import { OrderedContent } from '../../../components/OrderedContent';
import { TableResponsiveHolder } from '../../../components/TableResponsiveHolder';
import { useWallet } from '../../../components/wallet';
import useFlag from '../../../hooks/useFlag';
import theme from '../../../styles/theme';
import { useMessages } from '../../../utils/messages';
import { hasPrivateNodeAtom, nodeInfoDataAtom } from '../atoms';
import Block from './Block';
import useDontShowAgain from './useDontShowAgain';
import { useColorModeValue } from '../../../components/ui/color-mode';

interface TableInfo {
    boxProps?: BoxProps;
}

const NodeTable = () => {
    const bgTable = useColorModeValue('white', 'dark.gray.primary');
    const [data] = useAtom(nodeInfoDataAtom);
    const { list, loading } = data;
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
            <Table.Root bg={bgTable}>
                <Table.Header>
                    <Table.Row>
                        <Table.Cell {...thProps} role="columnheader">
                            Node Address
                        </Table.Cell>
                        <Table.Cell
                            whiteSpace="nowrap"
                            textAlign="right"
                            {...thProps}
                        >
                            Total Staked
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
                            Block Produced
                        </Table.Cell>
                        <Table.Cell whiteSpace="nowrap" {...thProps}>
                            Node Status
                        </Table.Cell>
                        <Table.Cell position="sticky" right="0" {...thProps}>
                            Manage
                        </Table.Cell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {loading && (
                        <Table.Row>
                            <Table.Cell colSpan={6}>
                                <HStack justify="center">
                                    <Spinner />
                                    <Text>Loading</Text>
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    )}
                    {!loading &&
                        list.map((node) => (
                            <Table.Row key={node.id}>
                                <Table.Cell>
                                    <Address
                                        chainId={chainId}
                                        ens
                                        address={node.id}
                                        truncated
                                        minWidth="120px"
                                        textDecoration="underline"
                                        px="0.5rem"
                                        py="0.25rem"
                                        color={addressColor}
                                        shouldDisplayFallbackAvatar
                                        fallbackAvatar={
                                            StakeCircledOutlinedIcon as FC<IconProps>
                                        }
                                    />
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    {node.totalStaked}
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    {node.totalRewards}
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    {node.blocksProduced}
                                </Table.Cell>
                                <Table.Cell>{node.nodeStatus}</Table.Cell>
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
                                            href={`/node/${node.id}/manage`}
                                        >
                                            <VisuallyHidden>
                                                Manage node {node.id}
                                            </VisuallyHidden>
                                            <PencilIcon
                                                data-testid={`pencil-svg-${node.id}`}
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

const SHOW_POS_V2_ALERT = 'showPoSV2AlertForPrivateNode';

const NodeTableBlock = ({ boxProps }: TableInfo) => {
    const bg = useColorModeValue('white', 'dark.gray.primary');
    const [hasPrivateNode] = useAtom(hasPrivateNodeAtom);
    const posV2Enabled = useFlag('posV2Enabled');
    const { value, handleDontShowAgain } = useDontShowAgain(SHOW_POS_V2_ALERT);
    const showAlert = posV2Enabled && value;
    const { open, onClose, onOpen } = useDisclosure({
        defaultOpen: showAlert,
    });

    const notificationTitle = useMessages('pos.v2');
    const authorizeTitle = useMessages('node.authorize.pos.steps.title');
    const authorizeSteps = [
        useMessages('node.authorize.pos.steps.one'),
        useMessages('node.authorize.pos.steps.two'),
        useMessages('node.authorize.pos.steps.three'),
        useMessages('node.authorize.pos.steps.four'),
    ];

    useEffect(() => {
        showAlert ? onOpen() : onClose();
    }, [showAlert, onClose, onOpen]);

    return (
        hasPrivateNode && (
            <Block bg={bg} {...boxProps}>
                <Box py="2">
                    {open && (
                        <Notification
                            status="warning"
                            title={notificationTitle}
                            subtitle={
                                <OrderedContent
                                    title={authorizeTitle}
                                    orderedItems={authorizeSteps}
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
                <Stack justify="space-between" direction={'row'}>
                    <Heading
                        fontSize="2xl"
                        mt={5}
                        mb={{ base: 4, md: 8 }}
                        fontWeight="medium"
                        lineHeight="0.75rem"
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
