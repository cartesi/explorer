// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Box,
    Flex,
    Heading,
    HStack,
    Dialog,
    Text,
    useClipboard,
    Icon,
} from '@chakra-ui/react';
import { flow } from 'lodash/fp';
import { useENS } from '../../../services/ens';
import { CopyIcon, DisconnectIcon, SwitchIcon } from '../../Icons';
import { useWallet } from '../../wallet';
import CloseButton from '../../CloseButton';

export interface IWalletMobileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WalletMobileModal = ({
    isOpen,
    onClose,
}: IWalletMobileModalProps) => {
    const { account, library, isHardwareWallet, selectAccount, deactivate } =
        useWallet();
    const ens = useENS(account ?? '');
    const clipboard = useClipboard({ value: account ?? '' });
    const showModalBody =
        account && library && selectAccount && isHardwareWallet;
    const disconnect = flow([deactivate, onClose]);

    return (
        <>
            <Dialog.Root
                open={isOpen}
                placement="center"
                onOpenChange={({ open }) => {
                    if (!open) {
                        onClose();
                    }
                }}
                size="xs"
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content overflow="hidden">
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                        <Dialog.Header>
                            <Dialog.Title>Your Account</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body
                            borderBottom="1px"
                            borderColor="gray.100"
                            borderStyle="solid"
                            backgroundColor="grey.80"
                            py={4}
                            paddingBottom={4}
                        >
                            <HStack w="full" gap={4} alignItems="center">
                                <Box flexGrow="1">
                                    <HStack>
                                        <Text fontSize="xs">
                                            Current wallet
                                        </Text>
                                    </HStack>
                                    <Heading m={0} size="sm">
                                        <Flex align="baseline">
                                            <Box maxWidth={210}>
                                                {ens.address}
                                            </Box>
                                        </Flex>
                                    </Heading>
                                </Box>
                                <Box>
                                    {clipboard.copied ? (
                                        <Text fontSize="xs">Copied</Text>
                                    ) : (
                                        <Icon
                                            as={CopyIcon}
                                            onClick={clipboard.copy}
                                            cursor="pointer"
                                            height="19px"
                                            width="19px"
                                            style={{ marginLeft: '0.625rem' }}
                                        />
                                    )}
                                </Box>
                            </HStack>
                        </Dialog.Body>
                        {account && library && (
                            <Dialog.Body
                                borderBottom="1px"
                                borderColor="gray.100"
                                borderStyle="solid"
                                backgroundColor="grey.80"
                                py={4}
                                paddingBottom={4}
                            >
                                <HStack w="full" gap={4} alignItems="center">
                                    <Box flexGrow="1">
                                        <Heading m={0} size="sm">
                                            <Flex align="baseline">
                                                <Box
                                                    onClick={disconnect}
                                                    aria-label="Disconnect wallet"
                                                    title="Disconnect wallet"
                                                    cursor="pointer"
                                                    fontSize={16}
                                                    fontWeight={400}
                                                >
                                                    Disconnect account
                                                </Box>
                                            </Flex>
                                        </Heading>
                                    </Box>
                                    <Box alignSelf="flex-end">
                                        <DisconnectIcon
                                            onClick={disconnect}
                                            aria-label="Disconnect wallet"
                                            cursor="pointer"
                                            height="18px"
                                            width="18px"
                                        />
                                    </Box>
                                </HStack>
                            </Dialog.Body>
                        )}

                        {showModalBody && (
                            <Dialog.Body
                                borderBottom="1px"
                                borderColor="gray.100"
                                borderStyle="solid"
                                backgroundColor="grey.80"
                                py={4}
                                paddingBottom={4}
                            >
                                <HStack w="full" gap={4} alignItems="center">
                                    <Box flexGrow="1">
                                        <Heading m={0} size="sm">
                                            <Flex align="baseline">
                                                <Box
                                                    onClick={selectAccount}
                                                    aria-label="Switch accounts"
                                                    title="Switch accounts"
                                                    fontSize={16}
                                                    fontWeight={400}
                                                >
                                                    Switch account
                                                </Box>
                                            </Flex>
                                        </Heading>
                                    </Box>
                                    <Box alignSelf="flex-end">
                                        <SwitchIcon
                                            onClick={selectAccount}
                                            aria-label="Switch accounts"
                                            width="18px"
                                            height="18px"
                                        />
                                    </Box>
                                </HStack>
                            </Dialog.Body>
                        )}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    );
};
