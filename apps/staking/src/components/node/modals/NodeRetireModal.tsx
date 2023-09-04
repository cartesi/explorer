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
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    Text,
    UseDisclosureProps,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';

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
    const bgModal = useColorModeValue('white', 'dark.gray.quaternary');
    const color = useColorModeValue('dark.gray.primary', 'white');
    const borderColor = useColorModeValue('dark.gray.gray.primary', 'white');
    const [addressValue, setAddressValue] = useState('');
    const { isOpen, onClose } = disclosure;

    useEffect(() => {
        setAddressValue('');
    }, [isOpen]);

    return (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent
                bg={bgModal}
                border="1px solid"
                borderColor={'dark.border.secondary'}
                borderRadius={'2xl'}
                color={color}
            >
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

                        <ModalCloseButton mt="8px !important" />
                    </HStack>
                    <Divider />
                </Box>
                <ModalBody>
                    <Text mb={8}>
                        After retiring the node all remaining ETH funds held by
                        the node will be transferred to your personal Ethereum
                        account. If you want to participate in the system,
                        please hire a new node with a new address.
                    </Text>
                    <FormControl id="retireNode" mb="auto">
                        <FormLabel fontWeight="bold">Node address</FormLabel>
                        <Input
                            value={addressValue}
                            onChange={(e) => setAddressValue(e.target.value)}
                        />
                        <FormHelperText>
                            Please enter your address to verify your action.
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
                            <WarningIcon color="light.support.alert" />
                            <Text fontSize="sm">
                                Once that node is retired, you cannot reuse it.
                            </Text>
                        </HStack>
                        <Button
                            width="full"
                            colorScheme="cyan"
                            disabled={address != addressValue?.trim()}
                            onClick={onConfirmRetire}
                        >
                            Retire
                        </Button>
                        <Button
                            width="full"
                            variant={'outline'}
                            borderColor={borderColor}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </VStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
