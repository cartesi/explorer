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

interface IStakingDepositProps {
    isOpen: boolean;
    onClose: () => void;
    onDeposit: (amount: string) => void;
}

export const StakingDeposit: FC<IStakingDepositProps> = ({
    isOpen: isOpen,
    onClose: onClose,
    onDeposit: onDeposit,
}) => {
    const [amount, setAmount] = useState('');
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
                    <ModalHeader>Deposit in pool balance</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                The Pool Balance is a transitory account where
                                your tokens are temporarily held before they can
                                be staked. This allows Cartesi to verify the
                                transaction as a precautionary measure to
                                increase security. The holding period last
                                usually for 6 hours. However, a high volume of
                                requests may result in a longer holding time.
                            </Text>
                            <FormControl id="depositAmount">
                                <FormLabel fontWeight="bold">Amount</FormLabel>
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
                                    Max. available/allowance: 2,000,000 CTSI
                                </FormHelperText>
                            </FormControl>
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    isFullWidth
                                    colorScheme="darkGray"
                                    onClick={() => {
                                        onDeposit(amount);
                                        onClose();
                                    }}
                                >
                                    Deposit
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
