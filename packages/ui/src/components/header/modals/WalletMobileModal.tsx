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
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useClipboard,
} from '@chakra-ui/react';
import { useENS } from '@explorer/services';
import { useWallet } from '@explorer/wallet';
import { CloseIcon, CopyIcon, DisconnectIcon, SwitchIcon } from '../../Icons';

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
    const { hasCopied, onCopy } = useClipboard(account ?? '');
    const showModalBody =
        account && library && selectAccount && isHardwareWallet;

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
                <ModalOverlay />
                <ModalContent borderRadius="0" minH="auto">
                    <HStack w="full" pt={0} spacing={2} alignItems="center">
                        <Box flexGrow="2">
                            <ModalHeader pt="1rem !important">
                                Your account
                            </ModalHeader>
                        </Box>
                        <Box flexGrow="1" cursor="pointer" paddingLeft="10">
                            <CloseIcon onClick={onClose} />
                        </Box>
                    </HStack>

                    <ModalBody
                        borderBottom="1px"
                        borderColor="gray.100"
                        backgroundColor="grey.80"
                        py={4}
                        paddingBottom={4}
                    >
                        <HStack w="full" spacing={4} alignItems="center">
                            <Box flexGrow="1">
                                <HStack>
                                    <Text fontSize="xs">Current wallet</Text>
                                </HStack>
                                <Heading m={0} size="sm">
                                    <Flex align="baseline">
                                        <Box maxWidth="210">{ens.address}</Box>
                                    </Flex>
                                </Heading>
                            </Box>
                            <Box>
                                {hasCopied ? (
                                    <Text fontSize="xs">Copied</Text>
                                ) : (
                                    <CopyIcon
                                        onClick={onCopy}
                                        cursor="pointer"
                                        height="19px"
                                        width="19px"
                                        ml="0.625rem"
                                    />
                                )}
                            </Box>
                        </HStack>
                    </ModalBody>
                    {account && library && (
                        <ModalBody
                            borderBottom="1px"
                            borderColor="gray.100"
                            py={5}
                            paddingBottom={4}
                        >
                            <HStack w="full" spacing={4} alignItems="center">
                                <Box flexGrow="1">
                                    <Heading m={0} size="sm">
                                        <Flex align="baseline">
                                            <Box
                                                onClick={deactivate}
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
                                        onClick={deactivate}
                                        aria-label="Disconnect wallet"
                                        cursor="pointer"
                                        height="18px"
                                        width="18px"
                                    />
                                </Box>
                            </HStack>
                        </ModalBody>
                    )}
                    {showModalBody && (
                        <ModalBody
                            borderBottom="1px"
                            borderColor="gray.100"
                            py={5}
                            paddingBottom={4}
                        >
                            <HStack w="full" spacing={4} alignItems="center">
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
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};
