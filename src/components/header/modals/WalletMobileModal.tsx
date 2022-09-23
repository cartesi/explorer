// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Text,
    Modal,
    ModalHeader,
    ModalBody,
    ModalContent,
    ModalOverlay,
    HStack,
    Box,
    useClipboard,
    Link,
    Flex,
    Heading,
    UseDisclosureProps,
} from '@chakra-ui/react';
import { DisconnectIcon, CopyIcon, SwitchIcon, CloseIcon } from '../../Icons';
import { useWallet } from '../../../contexts/wallet';
import { useENS } from '../../../services/ens';

export interface IWalletMobileModalProps {
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
}

export const WalletMobileModal = ({ disclosure, isOpen, onClose }) => {
    const { account, library, isHardwareWallet, onboard, deactivate } =
        useWallet();
    const ens = useENS(account);
    const { hasCopied, onCopy } = useClipboard(account);
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size={'xs'} isCentered>
                <ModalOverlay />
                <ModalContent borderRadius="0" p={0} minH="auto">
                    <HStack w="full" spacing={2} alignItems="center">
                        <Box flexGrow="2">
                            <ModalHeader>Your account</ModalHeader>
                        </Box>
                        <Box flexGrow="1" paddingLeft="10">
                            <CloseIcon onClick={onClose} />
                        </Box>
                    </HStack>

                    <ModalBody
                        borderBottom="1px"
                        borderColor={'gray.100'}
                        backgroundColor="grey.80"
                        py={4}
                        paddingBottom={4}
                    >
                        <HStack w="full" spacing={4} alignItems="center">
                            <Box flexGrow="1">
                                <HStack>
                                    <Text fontSize="xs" color={'gray10'}>
                                        Current wallet
                                    </Text>
                                </HStack>
                                <Heading m={0} size="sm">
                                    <Flex align="baseline">
                                        <Box maxWidth="210">{ens.address}</Box>
                                    </Flex>
                                </Heading>
                            </Box>
                            <Box>
                                {!hasCopied && (
                                    <Link>
                                        <CopyIcon
                                            onClick={onCopy}
                                            style={{
                                                height: 19,
                                                width: 19,
                                                marginLeft: 10,
                                            }}
                                        />
                                    </Link>
                                )}
                                {hasCopied && <Text fontSize="xs">Copied</Text>}
                            </Box>
                        </HStack>
                    </ModalBody>
                    {account && library && (
                        <ModalBody
                            borderBottom="1px"
                            borderColor={'gray.100'}
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
                                        style={{
                                            height: 18,
                                            width: 18,
                                        }}
                                    />
                                </Box>
                            </HStack>
                        </ModalBody>
                    )}
                    {account && library && onboard && isHardwareWallet && (
                        <ModalBody
                            borderBottom="1px"
                            borderColor={'gray.100'}
                            py={5}
                            paddingBottom={4}
                        >
                            <HStack w="full" spacing={4} alignItems="center">
                                <Box flexGrow="1">
                                    <Heading m={0} size="sm">
                                        <Flex align="baseline">
                                            <Box
                                                onClick={onboard.accountSelect}
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
                                        onClick={onboard.accountSelect}
                                        aria-label="Switch accounts"
                                        style={{
                                            height: 18,
                                            width: 18,
                                        }}
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
