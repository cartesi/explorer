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
import { BigNumber } from 'ethers';
import React, { FC, useRef, useState } from 'react';

interface IStakingWithdrawModalProps {
    isOpen: boolean;
    userBalance: BigNumber;
    onClose: () => void;
    onSave: (amount: string) => void;
}

export const StakingWithdrawModal: FC<IStakingWithdrawModalProps> = ({
    isOpen: isOpen,
    userBalance,
    onClose: onClose,
    onSave: onSave,
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
                        Withdraw from the pool balance to your wallet
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                Final step to receive tokens to your wallet!
                                Depending on the volume of requests, this
                                process can take up to 96 hours. To avoid
                                further delays, please return to complete your
                                withdrawal at the end of the specified waiting
                                period.
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
                            {/* <VStack
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
                                        In the event that the pool's liquidity
                                        is insufficient to meet your withdrawal
                                        request, you can appoint Cartesi to make
                                        up the shortfall by selecting Rebalance.
                                    </Text>
                                </VStack>
                            </VStack> */}
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    isFullWidth
                                    colorScheme="darkGray"
                                    onClick={() => {
                                        if (withdrawFullAmount === 'full') {
                                            onSave(
                                                userBalance
                                                    .toNumber()
                                                    .toString()
                                            );
                                        } else {
                                            onSave(amount);
                                        }

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
