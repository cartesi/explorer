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
    UseDisclosureProps,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import React, { FC, useRef, useState } from 'react';
import { CTSINumberInput } from '../CTSINumberInput';

interface IStakingPoolAllowenceModalProps {
    allowance: BigNumber;
    balance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newAllowance: BigNumber) => void;
}

export const StakingPoolAllowenceModal: FC<IStakingPoolAllowenceModalProps> = ({
    allowance,
    balance,
    disclosure,
    isOpen: isOpen,
    onClose: onClose,
    onSave: onSave,
}) => {
    const allowanceFormatted = parseFloat(formatUnits(allowance, 18));
    const balanceFormatted = parseFloat(formatUnits(balance, 18));

    // initialize allowance to current allowance
    const [newAllowance, setNewAllowance] =
        useState<number>(allowanceFormatted);

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
                                <CTSINumberInput
                                    defaultValue={allowanceFormatted}
                                    min={0}
                                    max={balanceFormatted}
                                    // ref={inputFocusRef}
                                    onChange={(
                                        newValue,
                                        bigNumberValue,
                                        value
                                    ) => {
                                        console.log('----');
                                        console.log('number value', newValue);
                                        console.log(
                                            'bigNumberValue value',
                                            bigNumberValue
                                        );
                                        console.log('text value', value);
                                    }}
                                />
                                {/* <NumberInput
                                    defaultValue={allowanceFormatted}
                                    min={0}
                                    max={balanceFormatted}
                                    ref={inputFocusRef}
                                    onBeforeInput={(e) => {
                                        if (e.data === '-' || e.data === '+')
                                            e.preventDefault();

                                        // if (
                                        //     e.data === '.' &&
                                        //     newAllowance.endsWith('.')
                                        // )
                                        //     e.preventDefault();
                                    }}
                                    onChange={(value) => {
                                        const allowanceValue =
                                            parseFloat(value);

                                        if (allowanceValue < 0) return;

                                        console.log('value', value);
                                        console.log(
                                            'new value',
                                            allowanceValue
                                        );

                                        setNewAllowance(allowanceValue);
                                    }}
                                >
                                    <NumberInputField />
                                    <InputRightElement
                                        color="gray.300"
                                        size="lg"
                                        pointerEvents="none"
                                        w={24}
                                        h="100%"
                                        children={<Box>CTSI</Box>}
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput> */}
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
                                        onSave(parseUnits(newAllowance, 18));
                                        disclosure.onClose();
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
