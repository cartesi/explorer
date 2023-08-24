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
    VStack,
    Text,
    FormHelperText,
    FormLabel,
    Modal,
    ModalCloseButton,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    UseDisclosureProps,
    Box,
    HStack,
    Divider,
    useColorModeValue,
    useToken,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC, useRef, useState } from 'react';
import { CTSINumberInput } from '../CTSINumberInput';

export interface IStakingPoolAllowanceModalProps {
    allowance: BigNumber;
    balance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newAllowance: BigNumber) => void;
}

export const StakingPoolAllowanceModal: FC<IStakingPoolAllowanceModalProps> = ({
    allowance,
    balance,
    disclosure,
    isOpen,
    onClose,
    onSave,
}) => {
    const allowanceFormatted = parseFloat(formatUnits(allowance, 18));
    const balanceFormatted = parseFloat(formatUnits(balance, 18));
    const buttonColorScheme = useColorModeValue('teal', 'cyan');
    const [formControlColor] = useToken('colors', ['form-control-color']);
    const helperTextColor = useColorModeValue(formControlColor, 'white');

    const [outputAllowance, setOutputAllowance] =
        useState<BigNumber>(allowance);

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
                    <Box pb={6}>
                        <HStack justify="space-between">
                            <Box
                                fontSize="xl"
                                fontWeight="bold"
                                p={4}
                                pl={8}
                                pb={4}
                            >
                                Edit pool allowance
                            </Box>

                            <ModalCloseButton mt="0.5rem !important" />
                        </HStack>
                        <Divider />
                    </Box>

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
                                    value={allowanceFormatted}
                                    min={0}
                                    onChange={(bigNumberValue) => {
                                        setOutputAllowance(bigNumberValue);
                                    }}
                                />
                                <FormHelperText color={helperTextColor}>
                                    The Pool Allowance can be edited at any
                                    time. Each edit is charged in the form of a
                                    gas fee like any Ethereum transaction.
                                </FormHelperText>
                            </FormControl>
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    width="full"
                                    colorScheme={buttonColorScheme}
                                    onClick={() => {
                                        onSave(outputAllowance);
                                        disclosure.onClose();
                                        onClose();
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    width="full"
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
