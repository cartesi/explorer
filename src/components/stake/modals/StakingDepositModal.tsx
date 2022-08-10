// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { EditIcon } from '@chakra-ui/icons';
import {
    Button,
    HStack,
    Box,
    Flex,
    Tooltip,
    Icon,
    IconButton,
    Heading,
    FormControl,
    VStack,
    Text,
    FormHelperText,
    FormLabel,
    Modal,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    UseDisclosureProps,
} from '@chakra-ui/react';
import React, { FC, useRef, useState } from 'react';
import { BigNumber, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { CTSINumberInput } from '../CTSINumberInput';
import CTSI from '../../pools/staking/CTSI';

export interface IStakingDepositModalProps {
    allowance: BigNumber;
    balance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (amount: BigNumber, where: String) => void;
}

export const StakingDepositModal: FC<IStakingDepositModalProps> = ({
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

    const [allowanceStep, setAllowanceStep] = useState<Boolean>(false);

    const [outputDeposit, setOutputDeposit] = useState<BigNumber>(
        constants.Zero
    );

    const inputFocusRef = useRef();

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                onClose();
                setAllowanceStep(false);
            }}
            isCentered
            initialFocusRef={inputFocusRef}
        >
            <ModalOverlay />
            <ModalContent>
                {allowance.isZero() || allowanceStep ? (
                    <>
                        <ModalHeader>Set Allowance and Deposit</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={5}>
                                <Text>
                                    Set the desired allowance. It is the total
                                    accrued amount of CTSI the pool is allowed
                                    to stake for you. This number should be
                                    equal or larger that the CTSI you plan to
                                    stake.
                                </Text>
                                <FormControl id="depositAmount">
                                    <FormLabel fontWeight="bold">
                                        Allowance Amount
                                    </FormLabel>
                                    <CTSINumberInput
                                        min={0}
                                        max={balanceFormatted}
                                        // ref={inputFocusRef}
                                        onChange={(bigNumberValue) => {
                                            setOutputAllowance(bigNumberValue);
                                        }}
                                    />
                                    <FormHelperText>
                                        The Pool Allowance can be edited at any
                                        time. Each edit is charged in the form
                                        of a gas fee like any Ethereum
                                        transaction.
                                    </FormHelperText>
                                </FormControl>
                            </VStack>
                            <ModalFooter px="0" pt={10}>
                                <VStack w="full" spacing={4}>
                                    <Button
                                        isFullWidth
                                        colorScheme="blue"
                                        onClick={() => {
                                            onSave(
                                                outputAllowance,
                                                'allowance'
                                            );
                                            setAllowanceStep(false);
                                        }}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        isFullWidth
                                        colorScheme="darkGray"
                                        variant="ghost"
                                        onClick={() => {
                                            onClose();
                                            setAllowanceStep(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </VStack>
                            </ModalFooter>
                        </ModalBody>
                    </>
                ) : (
                    <>
                        <ModalHeader>Deposit</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={5}>
                                <Text>
                                    You can deposit any amount of token to the
                                    pool as far as you have the tokens amount is
                                    lower than the set allowance. As a safety
                                    precaution, the average waiting time is 6
                                    hours.
                                </Text>

                                <HStack
                                    w="full"
                                    spacing={4}
                                    alignItems="center"
                                    p={4}
                                    bg="blue.50"
                                >
                                    <Box flexGrow="1">
                                        <HStack>
                                            <Text fontSize="sm">
                                                Your Allowance
                                            </Text>
                                            <Tooltip
                                                placement="top"
                                                label="Here you can see your current pool allowance."
                                                fontSize="small"
                                                bg="black"
                                                color="white"
                                            >
                                                <Icon color="gray.400" />
                                            </Tooltip>
                                        </HStack>
                                        <Heading m={0} size="sm">
                                            <Flex align="baseline">
                                                <CTSI
                                                    value={allowance}
                                                    fontSize="lg"
                                                />
                                                <Text ml={1}>CTSI</Text>
                                            </Flex>
                                        </Heading>
                                    </Box>
                                    <Box alignSelf="flex-end">
                                        <IconButton
                                            aria-label="Edit"
                                            size="sm"
                                            icon={<EditIcon />}
                                            variant="ghost"
                                            onClick={() => {
                                                setAllowanceStep(true);
                                            }}
                                        />
                                    </Box>
                                </HStack>

                                <Box>
                                    <Text fontSize="xs">
                                        It is the total accrued amount of CTSI
                                        the pool is allowed to stake for you.
                                        Each edit will cost ETH gas fee.
                                    </Text>
                                </Box>

                                <FormControl id="depositAmount">
                                    <FormLabel fontWeight="bold">
                                        Deposit Amount
                                    </FormLabel>
                                    <CTSINumberInput
                                        min={0}
                                        max={allowanceFormatted}
                                        onChange={(bigNumberValue) => {
                                            setOutputDeposit(bigNumberValue);
                                        }}
                                    />
                                    <FormHelperText>
                                        <Flex align="baseline">
                                            <Text mr="1">Wallet balance:</Text>

                                            <CTSI
                                                value={balance}
                                                fontSize="sm"
                                            />

                                            <Text ml="1">CTSI</Text>
                                        </Flex>
                                    </FormHelperText>
                                </FormControl>
                            </VStack>
                            <ModalFooter px="0" pt={10}>
                                <VStack w="full" spacing={4}>
                                    <Button
                                        isFullWidth
                                        colorScheme="blue"
                                        disabled={outputDeposit.isZero()}
                                        role="deposit-button"
                                        onClick={() => {
                                            onSave(outputDeposit, 'deposit');
                                            disclosure.onClose();
                                            onClose();
                                        }}
                                    >
                                        Deposit
                                    </Button>
                                    <Button
                                        isFullWidth
                                        variant="ghost"
                                        colorScheme="darkGray"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                </VStack>
                            </ModalFooter>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
