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
    VStack,
    Text,
    Stack,
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
} from '@chakra-ui/react';
import { BigNumber, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC, useRef, useState } from 'react';
import { CTSINumberInput } from '../CTSINumberInput';

export interface IStakingWithdrawModalProps {
    isOpen: boolean;
    userBalance: BigNumber;
    disclosure: UseDisclosureProps;
    onClose: () => void;
    onSave: (newWithdraw: BigNumber) => void;
}

export const StakingWithdrawModal: FC<IStakingWithdrawModalProps> = ({
    isOpen,
    userBalance,
    disclosure,
    onClose,
    onSave,
}) => {
    const [withdrawFullAmount, setWithdrawFullAmount] =
        useState<string>('full');
    const inputRef = useRef<HTMLInputElement>(null);
    const inputFocusRef = useRef();

    const userBalanceFormatted = parseFloat(formatUnits(userBalance, 18));
    const [outputWithdraw, setOutputWithdraw] = useState<BigNumber>(
        constants.Zero
    );
    const radioColorScheme = useColorModeValue('teal', 'cyan');
    const colorScheme = useColorModeValue('teal', 'blue');

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
                                mr={10}
                            >
                                Withdraw from the pool balance to your wallet
                            </Box>

                            <ModalCloseButton mt="8px !important" />
                        </HStack>
                        <Divider />
                    </Box>
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                Last step to receive tokens in your wallet!
                                Depending on the volume of requests, this
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
                                    name="unstakeAmount"
                                >
                                    <Stack>
                                        <Radio
                                            size="lg"
                                            value="full"
                                            colorScheme={radioColorScheme}
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
                                            colorScheme={radioColorScheme}
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
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    width="full"
                                    colorScheme={colorScheme}
                                    role="withdraw-button"
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
