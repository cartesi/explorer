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
    HStack,
    Box,
    useColorModeValue,
    Link,
    Divider,
    Modal,
    ModalCloseButton,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
} from '@chakra-ui/react';
import React, { FC, useEffect, useRef, useState } from 'react';
import { BigNumber, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { CTSINumberInput } from '../../stake/CTSINumberInput';

interface INodeStakeModalProps {
    allowance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newStake: BigNumber) => void;
}

export const NodeStakeModal: FC<INodeStakeModalProps> = ({
    allowance,
    disclosure,
    isOpen: isOpen,
    onClose: onClose,
    onSave: onSave,
}) => {
    if (!allowance) return null;

    const maxAllowanceFormatted = parseFloat(formatUnits(allowance, 18));
    const [outputStake, setOutputStake] = useState<BigNumber>(allowance);
    const [stakedValue, setStakedValue] = useState<any>(0);

    const toCTSI = (value: BigNumber) => {
        // formatter for CTSI values
        const numberFormat = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });

        return numberFormat.format(parseFloat(formatUnits(value, 18)));
    };

    const inputFocusRef = useRef();
    const bg = useColorModeValue('gray.50', 'header');

    useEffect(() => {
        if (!isOpen) {
            setStakedValue(0);
            setOutputStake(constants.Zero);
        }
    }, [isOpen]);

    const handleMaxStake = () => {
        setStakedValue(parseFloat(formatUnits(allowance, 18)));
        setOutputStake(allowance);
    };

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
                                Stake
                            </Box>

                            <ModalCloseButton mt="0.5rem !important" />
                        </HStack>
                        <Divider />
                    </Box>
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                The funds you stake will go to a maturing state.
                                It takes hours for your staking to achieve
                                maturity. You will see them in the “Maturing”
                                bar with a countdown timer. Learn more
                            </Text>
                            <FormControl id="stakeAmount">
                                <HStack justify="space-between">
                                    <FormLabel fontWeight="bold">
                                        Stake Amount
                                    </FormLabel>
                                    <Link
                                        color="blue.500"
                                        pb={2}
                                        onClick={handleMaxStake}
                                    >
                                        MAX STAKE
                                    </Link>
                                </HStack>
                                <CTSINumberInput
                                    value={stakedValue}
                                    min={0}
                                    max={maxAllowanceFormatted}
                                    onChange={(bigNumberValue) => {
                                        setOutputStake(bigNumberValue);
                                    }}
                                />
                                <FormHelperText>
                                    Allowance: {toCTSI(allowance)} CTSI
                                </FormHelperText>
                            </FormControl>
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    isFullWidth
                                    colorScheme="blue"
                                    disabled={outputStake.isZero()}
                                    onClick={() => {
                                        onSave(outputStake);
                                        disclosure.onClose();
                                        onClose();
                                    }}
                                >
                                    STAKE
                                </Button>
                                <Button isFullWidth bg={bg} onClick={onClose}>
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
