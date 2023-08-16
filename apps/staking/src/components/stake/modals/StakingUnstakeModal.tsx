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
    Collapse,
    Divider,
    FormControl,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    Radio,
    RadioGroup,
    Stack,
    Text,
    useColorModeValue,
    UseDisclosureProps,
    VStack,
} from '@chakra-ui/react';
import { BigNumber, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { FC, useRef, useState } from 'react';
import { Operation } from '../../../types/stake';
import { CTSINumberInput } from '../CTSINumberInput';

export type RemovalAction = 'full' | 'partial';
export interface IStakingUnstakeModalProps {
    isOpen: boolean;
    stakedBalance: BigNumber;
    disclosure: UseDisclosureProps;
    onClose: () => void;
    onSave: (op: Operation, newUnstake?: BigNumber) => void;
}

export const StakingUnstakeModal: FC<IStakingUnstakeModalProps> = ({
    isOpen,
    stakedBalance,
    disclosure,
    onClose,
    onSave,
}) => {
    const [unstakeFullAmount, setUnstakeFullAmount] =
        useState<Operation>('full');
    const inputRef = useRef<HTMLInputElement>(null);

    const stakeBalanceFormatted = parseFloat(formatUnits(stakedBalance, 18));
    const [outputUnstake, setOutputUnstake] = useState<BigNumber>(
        constants.Zero
    );
    const radioColorScheme = useColorModeValue('blue', 'cyan');

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
                                Unstake to withdraw
                            </Box>

                            <ModalCloseButton mt="8px !important" />
                        </HStack>
                        <Divider />
                    </Box>
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                Unstaked tokens will be transferred to the pool
                                balance for your withdrawal. Depending on the
                                volume of requests, this process can take up to
                                96 hours.
                            </Text>
                            <Text>
                                Kindly return to complete your withdrawal at the
                                end of the specified waiting period to avoid
                                further delays.
                            </Text>
                            <FormControl id="amount">
                                <RadioGroup
                                    defaultValue={unstakeFullAmount}
                                    name="unstakeAmount"
                                >
                                    <Stack>
                                        <Radio
                                            size="lg"
                                            value="full"
                                            colorScheme={radioColorScheme}
                                            onChange={() => {
                                                setUnstakeFullAmount('full');
                                                setOutputUnstake(
                                                    constants.Zero
                                                );
                                            }}
                                        >
                                            Full amount
                                        </Radio>
                                        <Radio
                                            size="lg"
                                            value="partial"
                                            colorScheme={radioColorScheme}
                                            onChange={() => {
                                                setUnstakeFullAmount('partial');
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
                                                <CTSINumberInput
                                                    min={0}
                                                    max={stakeBalanceFormatted}
                                                    onChange={(
                                                        bigNumberValue
                                                    ) => {
                                                        setOutputUnstake(
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
                                    colorScheme="blue"
                                    role="unstake-button"
                                    disabled={
                                        outputUnstake.isZero() &&
                                        unstakeFullAmount !== 'full'
                                    }
                                    onClick={() => {
                                        unstakeFullAmount === 'full'
                                            ? onSave('full')
                                            : onSave('partial', outputUnstake);

                                        disclosure.onClose();
                                        onClose();
                                    }}
                                >
                                    Unstake
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
