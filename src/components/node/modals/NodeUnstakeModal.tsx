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

interface INodeUnstakeModalProps {
    stakedBalance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newStake: BigNumber) => void;
}

export const NodeUnstakeModal: FC<INodeUnstakeModalProps> = ({
    stakedBalance,
    disclosure,
    isOpen: isOpen,
    onClose: onClose,
    onSave: onSave,
}) => {
    if (!stakedBalance) return null;

    const maxUnstakeFormatted = parseFloat(formatUnits(stakedBalance, 18));
    const [outputStake, setOutputStake] = useState<BigNumber>(stakedBalance);
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

    const handleMaxUnstake = () => {
        setStakedValue(parseFloat(formatUnits(stakedBalance, 18)));
        setOutputStake(stakedBalance);
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
                                Unstake
                            </Box>

                            <ModalCloseButton pt={2} mt={5} />
                        </HStack>
                        <Divider />
                    </Box>

                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                Bear in mind that your funds take 48 hours to
                                become unlocked. Be careful if you want to
                                unstake more funds while you have a non-zero
                                “Releasing” balance. In that case, the timer
                                restarts with the new unstaking funds added to
                                the previously “Releasing” balance. Learn more
                            </Text>
                            <FormControl id="stakeAmount">
                                <HStack justify="space-between">
                                    <FormLabel fontWeight="bold">
                                        Unstake Amount
                                    </FormLabel>
                                    <Link
                                        color="blue.500"
                                        pb={2}
                                        onClick={handleMaxUnstake}
                                    >
                                        MAX UNSTAKE
                                    </Link>
                                </HStack>
                                <CTSINumberInput
                                    value={stakedValue}
                                    max={maxUnstakeFormatted}
                                    onChange={(bigNumberValue) => {
                                        setOutputStake(bigNumberValue);
                                    }}
                                />
                                <FormHelperText>
                                    Staked Balance: {toCTSI(stakedBalance)} CTSI
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
                                    UNSTAKE
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
