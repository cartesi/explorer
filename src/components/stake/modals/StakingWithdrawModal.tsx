// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Button,
    FormControl,
    Collapse,
    Radio,
    RadioGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
    Text,
    Stack,
    UseDisclosureProps,
} from '@chakra-ui/react';
import { BigNumber, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC, useRef, useState } from 'react';
import { CTSINumberInput } from '../CTSINumberInput';

interface IStakingWithdrawModalProps {
    isOpen: boolean;
    userBalance: BigNumber;
    disclosure: UseDisclosureProps;
    onClose: () => void;
    onSave: (newWithdraw: BigNumber) => void;
}

export const StakingWithdrawModal: FC<IStakingWithdrawModalProps> = ({
    isOpen: isOpen,
    userBalance,
    disclosure,
    onClose: onClose,
    onSave: onSave,
}) => {
    const [withdrawFullAmount, setWithdrawFullAmount] =
        useState<string>('full');
    const inputRef = useRef<HTMLInputElement>(null);
    const inputFocusRef = useRef();

    const userBalanceFormatted = parseFloat(formatUnits(userBalance, 18));
    const [outputWithdraw, setOutputWithdraw] = useState<BigNumber>(
        constants.Zero
    );

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
                                Last step to receive tokens in your
                                wallet!Depending on the volume of requests, this
                                process can take up to 96 hours.
                            </Text>

                            <Text>
                                Please return to complete your withdrawal at the
                                end of the specified waiting period to avoid
                                further delays.
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

                                                setOutputWithdraw(
                                                    constants.Zero
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
                                                <CTSINumberInput
                                                    min={0}
                                                    max={userBalanceFormatted}
                                                    // ref={inputFocusRef}
                                                    onChange={(
                                                        bigNumberValue
                                                    ) => {
                                                        setOutputWithdraw(
                                                            bigNumberValue
                                                        );
                                                    }}
                                                />
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
                                    colorScheme="blue"
                                    disabled={
                                        outputWithdraw.isZero() &&
                                        withdrawFullAmount !== 'full'
                                    }
                                    onClick={() => {
                                        if (withdrawFullAmount === 'full') {
                                            onSave(userBalance);
                                        } else {
                                            onSave(outputWithdraw);
                                        }

                                        disclosure.onClose();
                                        onClose();
                                    }}
                                >
                                    Withdraw
                                </Button>
                                <Button
                                    isFullWidth
                                    colorScheme="darkGray"
                                    variant="ghost"
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
