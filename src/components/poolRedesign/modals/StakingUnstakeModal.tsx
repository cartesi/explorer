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
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
    Text,
    Collapse,
    Radio,
    RadioGroup,
    Stack,
    UseDisclosureProps,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC, useState, useRef } from 'react';
import { CTSINumberInput } from '../CTSINumberInput';

interface IStakingUnstakeModalProps {
    isOpen: boolean;
    userBalance: BigNumber;
    disclosure: UseDisclosureProps;
    onClose: () => void;
    onSave: (newUnstake: BigNumber) => void;
}

export const StakingUnstakeModal: FC<IStakingUnstakeModalProps> = ({
    isOpen: isOpen,
    userBalance,
    disclosure,
    onClose: onClose,
    onSave: onSave,
}) => {
    const [unstakeFullAmount, setUnstakeFullAmount] = useState<string>('full');
    const inputRef = useRef<HTMLInputElement>(null);

    const userBalanceFormatted = parseFloat(formatUnits(userBalance, 18));
    const [outputUnstake, setOutputUnstake] = useState<BigNumber>();

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Unstake first from staked balance to then withdraw from
                        pool balance
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                In order to request a withdrawal, you need to
                                first select the amount of tokens you desire to
                                withdraw from the staked balance. This request
                                will transfer the selected amount of tokens to
                                the pool balance, from where you then can
                                withdraw.
                            </Text>
                            <Text>
                                Depending on the volume of requests, this
                                process can take up to 96 hours. To avoid
                                further delays, please return to complete your
                                withdrawal at the end of the specified waiting
                                period.
                            </Text>
                            <FormControl id="amount">
                                <RadioGroup
                                    defaultValue={unstakeFullAmount}
                                    name="unstakeAmmount"
                                >
                                    <Stack>
                                        <Radio
                                            size="lg"
                                            value="full"
                                            colorScheme="blue"
                                            onChange={(e) =>
                                                setUnstakeFullAmount(
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
                                                setUnstakeFullAmount(
                                                    e.target.value
                                                );
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
                                                    max={userBalanceFormatted}
                                                    // ref={inputFocusRef}
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
                                    isFullWidth
                                    colorScheme="darkGray"
                                    onClick={() => {
                                        if (unstakeFullAmount === 'full') {
                                            onSave(userBalance);
                                        } else {
                                            onSave(outputUnstake);
                                        }

                                        disclosure.onClose();
                                        onClose();
                                    }}
                                >
                                    Unstake
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
