// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { WarningIcon } from '@chakra-ui/icons';
import {
    Button,
    FormControl,
    VStack,
    Text,
    FormHelperText,
    FormLabel,
    UseDisclosureProps,
    HStack,
    Box,
    Divider,
    Input,
    useColorModeValue,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
} from '../../Modal';

interface INodeRetireModalProps {
    address: string;
    disclosure: UseDisclosureProps;
    onConfirmRetire: () => void;
}

export const NodeRetireModal: FC<INodeRetireModalProps> = ({
    address,
    disclosure,
    onConfirmRetire,
}) => {
    const bg = useColorModeValue('white', 'gray.800');
    const [addressValue, setAddressValue] = useState('');
    const { isOpen, onClose } = disclosure;

    useEffect(() => {
        setAddressValue('');
    }, [isOpen]);

    return (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent minHeight={610}>
                <Box pb={6}>
                    <HStack justify="space-between">
                        <Box
                            fontSize="xl"
                            fontWeight="bold"
                            p={4}
                            pl={8}
                            pb={4}
                        >
                            Retire node
                        </Box>

                        <ModalCloseButton pt={2} mt={5} />
                    </HStack>
                    <Divider />
                </Box>
                <ModalBody>
                    <Text mb={8}>
                        After retire node all remaining ETH funds held by the
                        node will be transferred to your personal Ethereum
                        account. If you want to participate in the system,
                        please hire a new node with a new address.
                    </Text>
                    <FormControl id="retireNode">
                        <FormLabel fontWeight="bold">Node address</FormLabel>
                        <Input
                            value={addressValue}
                            onChange={(e) => setAddressValue(e.target.value)}
                        />
                        <FormHelperText>
                            Please entering your address to verify your action.
                        </FormHelperText>
                    </FormControl>
                </ModalBody>
                <ModalFooter pb="40px !important">
                    <VStack
                        alignItems="flex-start"
                        flexBasis={{ base: '100%', lg: '100%' }}
                        px={2}
                    >
                        <HStack spacing={2} mb={1}>
                            <WarningIcon color="orange.500" />
                            <Text fontSize="sm">
                                Once that node is retired, you cannot reuse it
                            </Text>
                        </HStack>
                        <Button
                            isFullWidth
                            colorScheme="blue"
                            disabled={address != addressValue?.trim()}
                            onClick={onConfirmRetire}
                        >
                            Retire
                        </Button>
                        <Button isFullWidth bg={bg} onClick={onClose}>
                            Cancel
                        </Button>
                    </VStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
