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
    Button,
    FormControl,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
    Text,
    FormHelperText,
    FormLabel,
} from '@chakra-ui/react';
import React, { FC, useRef, useState } from 'react';

interface IStakingPoolAllowenceProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (amount: string) => void;
}

export const StakingPoolAllowence: FC<IStakingPoolAllowenceProps> = ({
    isOpen: isOpen,
    onClose: onClose,
    onSave: onSave,
}) => {
    const [amount, setAmount] = useState<string>('');
    const inputFocusRef = useRef();
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                initialFocusRef={inputFocusRef}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit pool allowance</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                Additional layer of protection with a max amount
                                of CTSI tokens that this pool can transfer from
                                your wallet.
                            </Text>
                            <FormControl id="depositAmount">
                                <FormLabel fontWeight="bold">
                                    Pool allowance
                                </FormLabel>
                                <InputGroup>
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        size="lg"
                                        pr={16}
                                        ref={inputFocusRef}
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(e.target.value)
                                        }
                                    />
                                    <InputRightElement
                                        color="gray.300"
                                        size="lg"
                                        pointerEvents="none"
                                        w={14}
                                        h="100%"
                                        children={<Box>CTSI</Box>}
                                    />
                                </InputGroup>
                                <FormHelperText>
                                    The Pool Allowance can be edited at any
                                    time. Each edit is charged in the form of a
                                    gas fee like any Ethereum transaction.
                                </FormHelperText>
                            </FormControl>
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    isFullWidth
                                    colorScheme="darkGray"
                                    onClick={() => {
                                        onSave(amount);
                                        onClose();
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    isFullWidth
                                    colorScheme="darkGray"
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                            </VStack>
                        </ModalFooter>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
