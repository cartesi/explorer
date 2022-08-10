// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    HStack,
    Tag,
    TagLabel,
    Box,
    Flex,
    useClipboard,
    Link,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Heading,
} from '@chakra-ui/react';
import { ArrowUpDownIcon, CopyIcon } from '@chakra-ui/icons';
import React, { FC } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useENS } from '../../services/ens';
import { truncateStringMobile } from '../../utils/stringUtilsMobile';
import { useWallet } from '../../contexts/wallet';
import { AiOutlineDisconnect } from 'react-icons/ai';
import { CgArrowsExchange } from 'react-icons/cg';

const AccountMobile: FC = () => {
    const { account, library, isHardwareWallet, onboard, deactivate } =
        useWallet();
    const ens = useENS(account);
    const { hasCopied, onCopy } = useClipboard(account);
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!account) {
        return null;
    }

    return (
        <Tag
            size="md"
            borderRadius="0"
            colorScheme="gray"
            h={10}
            backgroundColor="white"
            onClick={() => onOpen()}
            key={'xs'}
        >
            <HStack w="full" spacing={4} alignItems="center">
                <Box flexGrow="1">
                    <Jazzicon
                        diameter={15}
                        seed={jsNumberForAddress(account)}
                    />
                    <TagLabel px={2}>
                        {ens.name ||
                            truncateStringMobile(ens.address || account)}
                    </TagLabel>
                </Box>
                <Box alignSelf="flex-end">
                    <ArrowUpDownIcon />
                </Box>
            </HStack>

            <Modal onClose={onClose} size={'xs'} isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent borderRadius="0" p={0}>
                    <ModalHeader>Your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody borderBottom="1px" borderColor={'gray.100'}>
                        <HStack w="full" spacing={4} alignItems="center">
                            <Box flexGrow="1">
                                <HStack>
                                    <Text fontSize="xs">Current wallet</Text>
                                </HStack>
                                <Heading m={0} size="sm">
                                    <Flex align="baseline">
                                        <Box maxWidth="62%">{ens.address}</Box>
                                        <Box>
                                            {!hasCopied && (
                                                <Link>
                                                    <CopyIcon
                                                        onClick={onCopy}
                                                    />
                                                </Link>
                                            )}
                                            {hasCopied && (
                                                <Text
                                                    maxWidth="52%"
                                                    fontSize="xs"
                                                >
                                                    Copied
                                                </Text>
                                            )}
                                        </Box>
                                    </Flex>
                                </Heading>
                            </Box>
                        </HStack>
                    </ModalBody>

                    <ModalBody borderBottom="1px" borderColor={'gray.100'}>
                        {account && library && (
                            <HStack w="full" spacing={4} alignItems="center">
                                <Box flexGrow="1">
                                    <Heading m={0} size="sm">
                                        <Flex align="baseline">
                                            <Box
                                                onClick={deactivate}
                                                aria-label="Disconnect wallet"
                                                title="Disconnect wallet"
                                            >
                                                Disconnect account
                                            </Box>
                                        </Flex>
                                    </Heading>
                                </Box>
                                <Box alignSelf="flex-end">
                                    <AiOutlineDisconnect
                                        onClick={deactivate}
                                        aria-label="Disconnect wallet"
                                        title="Disconnect wallet"
                                    />
                                </Box>
                            </HStack>
                        )}
                    </ModalBody>
                    <ModalBody borderBottom="1px" borderColor={'gray.100'}>
                        {account && library && onboard && isHardwareWallet && (
                            <HStack w="full" spacing={4} alignItems="center">
                                <Box flexGrow="1">
                                    <Heading m={0} size="sm">
                                        <Flex align="baseline">
                                            <Box
                                                onClick={onboard.accountSelect}
                                                aria-label="Switch accounts"
                                                title="Switch accounts"
                                            >
                                                Switch accounts
                                            </Box>
                                        </Flex>
                                    </Heading>
                                </Box>
                                <Box alignSelf="flex-end">
                                    <CgArrowsExchange
                                        onClick={onboard.accountSelect}
                                        aria-label="Switch accounts"
                                        title="Switch accounts"
                                    />
                                </Box>
                            </HStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Tag>
    );
};

export default AccountMobile;
