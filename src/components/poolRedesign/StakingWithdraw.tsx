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
    Collapse,
    Radio,
    RadioGroup,
    HStack,
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
    Spinner,
    VStack,
    Text,
    Stack,
} from '@chakra-ui/react';
import React, { FC, useRef, useState } from 'react';

interface IStakingWithdrawProps {
    isOpen: boolean;
    onClose: () => void;
    onWithdraw: (amount: string) => void;
}

export const StakingWithdraw: FC<IStakingWithdrawProps> = ({
    isOpen: isOpen,
    onClose: onClose,
    onWithdraw: onWithdraw,
}) => {
    const [amount, setAmount] = useState<string>('');
    const [withdrawFullAmount, setWithdrawFullAmount] =
        useState<string>('full');
    const inputRef = useRef<HTMLInputElement>(null);
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
                        Withdraw from the pool balance to my wallet balance
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                Last step to receive tokens to your wallet! It
                                usually takes a few hours to be ready.
                            </Text>
                            <FormControl id="amount">
                                <RadioGroup
                                    defaultValue={withdrawFullAmount}
                                    name="unstakeAmmount"
                                >
                                    <Stack>
                                        <Radio
                                            size="lg"
                                            value="full"
                                            colorScheme="blue"
                                            onChange={(e) =>
                                                setWithdrawFullAmount(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            Full amount
                                        </Radio>
                                        <Radio
                                            size="lg"
                                            value="partial"
                                            colorScheme="blue"
                                            onChange={(e) => {
                                                setWithdrawFullAmount(
                                                    e.target.value
                                                );
                                                inputRef.current?.focus();
                                            }}
                                        >
                                            Partial amount
                                        </Radio>
                                        <Collapse
                                            in={
                                                withdrawFullAmount === 'partial'
                                            }
                                            animateOpacity
                                            unmountOnExit
                                        >
                                            <FormControl
                                                id="withdrawAmount"
                                                pl={7}
                                            >
                                                <InputGroup>
                                                    <Input
                                                        type="text"
                                                        inputMode="decimal"
                                                        placeholder="0.00"
                                                        size="lg"
                                                        pr={16}
                                                        value={amount}
                                                        ref={inputRef}
                                                        onChange={(e) =>
                                                            setAmount(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <InputRightElement
                                                        color="gray.300"
                                                        size="lg"
                                                        pointerEvents="none"
                                                        w={14}
                                                        h="100%"
                                                        children={
                                                            <Box>CTSI</Box>
                                                        }
                                                    />
                                                </InputGroup>
                                            </FormControl>
                                        </Collapse>
                                    </Stack>
                                </RadioGroup>
                            </FormControl>
                            <VStack
                                spacing={4}
                                w="full"
                                alignItems="flex-start"
                                justifyContent="flex-start"
                            >
                                <HStack>
                                    <Button
                                        size="md"
                                        colorScheme="blue"
                                        variant="link"
                                        textDecoration="underline"
                                        _hover={{
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Rebalance
                                    </Button>
                                    <Spinner
                                        size="sm"
                                        speed="0.65s"
                                        emptyColor="gray.200"
                                        color="blue.500"
                                    />
                                </HStack>
                                <VStack alignItems="flex-start" spacing={0}>
                                    <Text>Available liqudity: 10 CTSI</Text>
                                    <Text color="gray.500" fontSize="sm">
                                        Cartesi supports to rebalance the pool
                                        liqudity to withdraw.
                                    </Text>
                                </VStack>
                            </VStack>
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    isFullWidth
                                    colorScheme="darkGray"
                                    onClick={() => {
                                        onWithdraw(amount);
                                        onClose();
                                    }}
                                >
                                    Withdraw
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
