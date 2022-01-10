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

interface IStakingStakeProps {
    isOpen: boolean;
    onClose: () => void;
    onStake: (amount: string) => void;
}

export const StakingStake: FC<IStakingStakeProps> = ({
    isOpen: isOpen,
    onClose: onClose,
    onStake: onStake,
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
                    <ModalHeader>
                        Stake from your pool balance to your staked balance
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                Text explaining details about this action to
                                inform and reassure the user.
                            </Text>
                            <FormControl id="stakeAmount">
                                <FormLabel fontWeight="bold">Amount</FormLabel>
                                <InputGroup>
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        size="lg"
                                        pr={16}
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(e.target.value)
                                        }
                                        ref={inputFocusRef}
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
                                    Max. available: 500 CTSI
                                </FormHelperText>
                            </FormControl>
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    isFullWidth
                                    colorScheme="darkGray"
                                    onClick={() => {
                                        onStake(amount);
                                        onClose();
                                    }}
                                >
                                    Stake
                                </Button>
                                <Button
                                    isFullWidth
                                    variant="outline"
                                    colorScheme="darkGray"
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
