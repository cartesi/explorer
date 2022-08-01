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
    UseDisclosureProps,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC, useRef, useState } from 'react';
import {
    Modal,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
} from '../../Modal';
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
                                    value={allowanceFormatted}
                                    min={0}
                                    max={balanceFormatted}
                                    onChange={(bigNumberValue) => {
                                        setOutputAllowance(bigNumberValue);
                                    }}
                                />
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
                                    colorScheme="blue"
                                    onClick={() => {
                                        onSave(outputAllowance);
                                        disclosure.onClose();
                                        onClose();
                                    }}
                                >
                                    Save
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
