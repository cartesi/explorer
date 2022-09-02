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
    ModalCloseButton,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    UseDisclosureProps,
    Divider,
    TagLabel,
    useColorModeValue,
} from '@chakra-ui/react';
import React, { FC, useRef, useState } from 'react';
import { BigNumber, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { CTSINumberInput } from '../CTSINumberInput';
import CTSI from '../../pools/staking/CTSI';
import { CheckCircleIcon, PencilIconWhite } from '../../Icons';

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
    const color = useColorModeValue('black', 'white');
    const fontColor = useColorModeValue('black', 'black');
    const max_depositColor = useColorModeValue('blue.500', 'white');
    const iconColor = useColorModeValue('black', 'black');

    const inputFocusRef = useRef();

    return (
        <Modal
            size={'md'}
            isOpen={isOpen}
            onClose={() => {
                onClose();
                setAllowanceStep(false);
            }}
            isCentered
            initialFocusRef={inputFocusRef}
        >
            <ModalOverlay />

            <ModalContent borderRadius="0" p={0} minH="auto">
                {allowance.isZero() || allowanceStep ? (
                    <>
                        <Box pb={6}>
                            <HStack justify="space-between">
                                <Box
                                    fontSize="xl"
                                    fontWeight="bold"
                                    p={4}
                                    pl={8}
                                    pb={4}
                                >
                                    Deposit
                                </Box>

                                <ModalCloseButton mt="8px !important" />
                            </HStack>
                            <Divider />
                        </Box>
                        <ModalBody>
                            <VStack spacing={5}>
                                <HStack w="full" spacing={4}>
                                    <Box flexGrow="0">
                                        <CheckCircleIcon w={21} h={21} mr={2} />
                                        <TagLabel
                                            fontSize={18}
                                            fontWeight={400}
                                        >
                                            Set Allowance
                                        </TagLabel>
                                    </Box>
                                    <Box alignSelf="center">
                                        <Divider
                                            orientation="horizontal"
                                            w={12}
                                            borderColor={color}
                                        />
                                    </Box>
                                    <Box flexGrow="1">
                                        <CheckCircleIcon
                                            w={21}
                                            h={21}
                                            mr={2}
                                            color="gray.300"
                                            pointerEvents="none"
                                        />
                                        <TagLabel
                                            fontSize={18}
                                            fontWeight={400}
                                            color="gray.300"
                                            pointerEvents="none"
                                        >
                                            Deposit
                                        </TagLabel>
                                    </Box>
                                </HStack>
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
                                        First time setting will cost ETH gas
                                        fee. It will display in the wallet
                                        transaction.
                                    </FormHelperText>
                                </FormControl>
                            </VStack>
                            <ModalFooter px="0">
                                <VStack w="full">
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
                                </VStack>
                            </ModalFooter>
                        </ModalBody>
                    </>
                ) : (
                    <>
                        <Box pb={6}>
                            <HStack justify="space-between">
                                <Box
                                    fontSize="xl"
                                    fontWeight="bold"
                                    p={4}
                                    pl={8}
                                    pb={4}
                                >
                                    Deposit
                                </Box>

                                <ModalCloseButton mt="8px !important" />
                            </HStack>
                            <Divider />
                        </Box>
                        <ModalBody>
                            <VStack spacing={5}>
                                <HStack w="full" spacing={4}>
                                    <Box flexGrow="0">
                                        <CheckCircleIcon
                                            w={21}
                                            h={21}
                                            mr={2}
                                            bgColor="blue.50"
                                            rounded={'full'}
                                            color={fontColor}
                                        />
                                        <TagLabel
                                            fontSize={18}
                                            fontWeight={400}
                                        >
                                            Set Allowance
                                        </TagLabel>
                                    </Box>
                                    <Box alignSelf="center">
                                        <Divider
                                            orientation="horizontal"
                                            w={12}
                                            borderColor={color}
                                        />
                                    </Box>
                                    <Box flexGrow="1">
                                        <CheckCircleIcon w={21} h={21} mr={2} />
                                        <TagLabel
                                            fontSize={18}
                                            fontWeight={400}
                                        >
                                            Deposit
                                        </TagLabel>
                                    </Box>
                                </HStack>

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
                                            <Text
                                                fontSize="sm"
                                                color={fontColor}
                                            >
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
                                                    color={fontColor}
                                                />
                                                <Text ml={1} color={fontColor}>
                                                    CTSI
                                                </Text>
                                            </Flex>
                                        </Heading>
                                    </Box>
                                    <Box alignSelf="flex-end">
                                        {/* <IconButton
                                            aria-label="Edit"
                                            size="md"
                                            icon={<EditIcon />}
                                            variant="ghost"
                                            onClick={() => {
                                                setAllowanceStep(true);
                                            }}
                                            _hover={{
                                                background: 'blue.50',
                                            }}
                                        /> */}
                                        <IconButton
                                            aria-label="Edit"
                                            size="sm"
                                            icon={
                                                <PencilIconWhite
                                                    style={{
                                                        height: 25,
                                                        width: 26,
                                                    }}
                                                    color={iconColor}
                                                />
                                            }
                                            variant="blue.50"
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
                                    <HStack w="full" spacing={4}>
                                        <Box flexGrow="1">
                                            <FormLabel fontWeight="bold">
                                                Deposit Amount
                                            </FormLabel>
                                        </Box>
                                        <Box alignSelf="flex-end">
                                            <FormLabel
                                                fontWeight="400"
                                                fontSize={16}
                                                color={max_depositColor}
                                                textAlign={'right'}
                                            >
                                                MAX DEPOSIT
                                            </FormLabel>
                                        </Box>
                                    </HStack>
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
