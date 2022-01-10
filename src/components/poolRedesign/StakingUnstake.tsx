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
    Collapse,
    Radio,
    RadioGroup,
    Stack,
} from '@chakra-ui/react';
import React, { FC, useState, useRef } from 'react';

interface IStakingUnstakeProps {
    isOpen: boolean;
    onClose: () => void;
    onUnstake: (amount: string) => void;
}

export const StakingUnstake: FC<IStakingUnstakeProps> = ({
    isOpen: isOpen,
    onClose: onClose,
    onUnstake: onUnstake,
}) => {
    const [amount, setAmount] = useState<string>('');
    const [unstakeFullAmount, setUnstakeFullAmount] = useState<string>('full');
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Unstake from your pool balance to your staked balance
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                In order to withdraw, it requires to unstake
                                from the to staked balance first. It might take
                                a moment to arrive to pool balance to withdraw.
                            </Text>
                            <FormControl id="amount">
                                <RadioGroup
                                    defaultValue={unstakeFullAmount}
                                    name="unstakeAmmount"
                                >
                                    <Stack>
                                        <Radio
                                            size="lg"
                                            value="full"
                                            colorScheme="blue"
                                            onChange={(e) =>
                                                setUnstakeFullAmount(
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
                                                setUnstakeFullAmount(
                                                    e.target.value
                                                );
                                                inputRef.current?.focus();
                                            }}
                                        >
                                            Partial amount
                                        </Radio>
                                        <Collapse
                                            in={unstakeFullAmount === 'partial'}
                                            animateOpacity
                                            unmountOnExit
                                        >
                                            <FormControl
                                                id="unstakeAmount"
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
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    isFullWidth
                                    colorScheme="darkGray"
                                    onClick={() => {
                                        onUnstake(amount);
                                        onClose();
                                    }}
                                >
                                    Unstake
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
