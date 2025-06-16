// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { TbAlertTriangleFilled } from 'react-icons/tb';
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Field,
    HStack,
    Input,
    Separator,
    Text,
    UseDisclosureProps,
    VStack,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { useColorModeValue } from '../../ui/color-mode';

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
    const colorScheme = useColorModeValue('teal', 'cyan');
    const inputBorderColor = useColorModeValue(undefined, 'gray.300');
    const [addressValue, setAddressValue] = useState('');
    const { open, onClose } = disclosure;

    useEffect(() => {
        setAddressValue('');
    }, [open]);

    return (
        <Dialog.Root
            open={open}
            placement="center"
            onOpenChange={({ open }) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content
                    bg={bgModal}
                    border="1px solid"
                    borderColor={'dark.border.secondary'}
                    borderRadius={'2xl'}
                    color={color}
                >
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                    <Dialog.Header>
                        <Dialog.Title>
                            <Box fontSize="xl" fontWeight="bold">
                                Retire node
                            </Box>
                        </Dialog.Title>
                    </Dialog.Header>
                    <Separator />
                    <Dialog.Body>
                        <Text mb={8}>
                            After retiring the node all remaining ETH funds held
                            by the node will be transferred to your personal
                            Ethereum account. If you want to participate in the
                            system, please hire a new node with a new address.
                        </Text>
                        <Field.Root id="retireNode" mb="auto">
                            <Field.Label fontWeight="bold">
                                Node address
                            </Field.Label>
                            <Input
                                value={addressValue}
                                borderColor={inputBorderColor}
                                onChange={(e) =>
                                    setAddressValue(e.target.value)
                                }
                            />
                            <Field.HelperText color={inputBorderColor}>
                                Please enter your address to verify your action.
                            </Field.HelperText>
                        </Field.Root>
                    </Dialog.Body>
                    <Dialog.Footer pb="40px !important">
                        <VStack
                            alignItems="flex-start"
                            flexBasis={{ base: '100%', lg: '100%' }}
                            px={2}
                        >
                            <HStack gap={2} mb={1}>
                                <Box color="light.support.alert">
                                    <TbAlertTriangleFilled />
                                </Box>
                                <Text fontSize="sm">
                                    Once that node is retired, you cannot reuse
                                    it.
                                </Text>
                            </HStack>
                            <Button
                                width="full"
                                colorPalette={colorScheme}
                                disabled={address != addressValue?.trim()}
                                onClick={onConfirmRetire}
                            >
                                Retire
                            </Button>
                            <Button
                                width="full"
                                colorPalette="gray"
                                variant="ghost"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </VStack>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};
