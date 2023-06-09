// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

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
    Box,
    HStack,
    Divider,
    Modal,
    ModalCloseButton,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    useColorModeValue,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC, useRef, useState } from 'react';
import { CTSINumberInput } from '../../stake/CTSINumberInput';

interface INodeAllowanceModalProps {
    allowance: BigNumber;
    balance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newAllowance: BigNumber) => void;
}

export const NodeAllowanceModal: FC<INodeAllowanceModalProps> = ({
    allowance,
    balance,
    disclosure,
    isOpen: isOpen,
    onClose: onClose,
    onSave: onSave,
}) => {
    const allowanceFormatted = parseFloat(formatUnits(allowance, 18));
    const balanceFormatted = parseFloat(formatUnits(balance, 18));
    const bg = useColorModeValue('gray.50', 'header');

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
                                Set allowance
                            </Box>

                            <ModalCloseButton mt="0.5rem !important" />
                        </HStack>
                        <Divider />
                    </Box>
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                This is going to be the maximum amount of CTSI
                                that Cartesi’s staking contract will be able to
                                receive from your personal account. Please enter
                                the total value you wish to allow the CTSI
                                staking contract to hold.
                            </Text>
                            <FormControl id="depositAmount">
                                <FormLabel fontWeight="bold">
                                    Allowance amount
                                </FormLabel>
                                <CTSINumberInput
                                    value={allowanceFormatted}
                                    min={0}
                                    // ref={inputFocusRef}
                                    onChange={(bigNumberValue) => {
                                        setOutputAllowance(bigNumberValue);
                                    }}
                                />
                                <FormHelperText>
                                    In this case, each edit will cost your ETH
                                    gas fee.
                                </FormHelperText>
                            </FormControl>
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    width="full"
                                    colorScheme="blue"
                                    onClick={() => {
                                        onSave(outputAllowance);
                                        disclosure.onClose();
                                        onClose();
                                    }}
                                >
                                    APPROVE
                                </Button>
                                <Button width="full" bg={bg} onClick={onClose}>
                                    CANCEL
                                </Button>
                            </VStack>
                        </ModalFooter>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
