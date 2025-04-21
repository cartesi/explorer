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
    Divider,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    HStack,
    Icon,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    Stack,
    Tag,
    TagLabel,
    Text,
    Tooltip,
    useColorModeValue,
    UseDisclosureProps,
    useToken,
    VStack,
} from '@chakra-ui/react';
import { BigNumber, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { FC, useEffect, useRef, useState } from 'react';
import { CheckCircleIcon, PencilIconWhite } from '../../Icons';
import CTSI from '../../pools/staking/CTSI';
import { CTSINumberInput } from '../CTSINumberInput';
import { FocusableElement } from '@chakra-ui/utils';

export interface IStakingDepositModalProps {
    allowance: BigNumber;
    balance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (amount: BigNumber, where: string) => void;
}

export const StakingDepositModal: FC<IStakingDepositModalProps> = ({
    allowance,
    balance,
    disclosure,
    isOpen,
    onClose,
    onSave,
}) => {
    const formatBigNumber = (value: BigNumber) =>
        parseFloat(formatUnits(value, 18));

    const allowanceFormatted = parseFloat(formatUnits(allowance, 18));
    const balanceFormatted = parseFloat(formatUnits(balance, 18));

    const [outputAllowance, setOutputAllowance] =
        useState<BigNumber>(allowance);

    const [allowanceStep, setAllowanceStep] = useState<boolean>(false);

    const [outputDeposit, setOutputDeposit] = useState<BigNumber>(
        constants.Zero
    );
    const formattedDepositValue = formatBigNumber(outputDeposit);

    const color = useColorModeValue('black', 'white');
    const maxDepositColor = useColorModeValue('dark.secondary', 'dark.primary');
    const [formControlColor] = useToken('colors', ['form-control-color']);
    const tagColor = useColorModeValue('gray.900', 'white');
    const infoBg = useColorModeValue('dark.gray.senary', 'dark.gray.tertiary');
    const infoColor = useColorModeValue('black', 'white');
    const checkIconBg = useColorModeValue('dark.gray.senary', 'white');
    const colorScheme = useColorModeValue('teal', 'blue');
    const inputFocusRef = useRef<FocusableElement>(null);

    useEffect(() => {
        if (!isOpen) {
            setOutputDeposit(BigNumber.from(0));
        }
    }, [isOpen]);

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

            <ModalContent borderRadius="0" p={0} minH="610px">
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
                                    <Box
                                        flexGrow="0"
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <CheckCircleIcon w={5} h={5} mr={1} />
                                        <Tag bg="transparent">
                                            <TagLabel
                                                fontSize="lg"
                                                fontWeight="normal"
                                                color={tagColor}
                                            >
                                                Set Allowance
                                            </TagLabel>
                                        </Tag>
                                    </Box>
                                    <Box alignSelf="center">
                                        <Divider
                                            orientation="horizontal"
                                            w={12}
                                            borderColor={color}
                                        />
                                    </Box>
                                    <Box
                                        flexGrow="1"
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <CheckCircleIcon
                                            w={5}
                                            h={5}
                                            mr={1}
                                            color="gray.300"
                                            pointerEvents="none"
                                        />
                                        <Tag bg="transparent">
                                            <TagLabel
                                                fontSize="lg"
                                                fontWeight="normal"
                                                color={tagColor}
                                                pointerEvents="none"
                                            >
                                                Deposit
                                            </TagLabel>
                                        </Tag>
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
                                        onChange={(bigNumberValue) => {
                                            setOutputAllowance(bigNumberValue);
                                        }}
                                    />
                                    <FormHelperText color={formControlColor}>
                                        First time setting will cost ETH gas
                                        fee. It will display in the wallet
                                        transaction.
                                    </FormHelperText>
                                </FormControl>
                            </VStack>
                            <ModalFooter px="0">
                                <VStack w="full">
                                    <Button
                                        width="full"
                                        colorScheme={colorScheme}
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
                                            w={5}
                                            h={5}
                                            bgColor={checkIconBg}
                                            borderRadius="full"
                                            color="black"
                                        />
                                        <Tag bg="transparent">
                                            <TagLabel
                                                fontSize="lg"
                                                fontWeight="normal"
                                            >
                                                Set Allowance
                                            </TagLabel>
                                        </Tag>
                                    </Box>
                                    <Box alignSelf="center">
                                        <Divider
                                            orientation="horizontal"
                                            w={12}
                                            borderColor={color}
                                        />
                                    </Box>
                                    <Box flexGrow="1">
                                        <CheckCircleIcon w={5} h={5} />
                                        <Tag bg="transparent">
                                            <TagLabel
                                                fontSize="lg"
                                                fontWeight="normal"
                                            >
                                                Deposit
                                            </TagLabel>
                                        </Tag>
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
                                    color={infoColor}
                                    bg={infoBg}
                                    borderRadius="6px"
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
                                            >
                                                <Icon w={3.5} h={3.5} />
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
                                    <Box>
                                        <IconButton
                                            aria-label="Edit"
                                            size="sm"
                                            bg="transparent"
                                            onClick={() => {
                                                setAllowanceStep(true);
                                            }}
                                        >
                                            <Icon
                                                as={PencilIconWhite}
                                                w={6}
                                                h={6}
                                            />
                                        </IconButton>
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
                                    <FormLabel mr={0}>
                                        <Stack
                                            direction="row"
                                            justify="space-between"
                                            alignItems="center"
                                        >
                                            <span
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                Deposit Amount
                                            </span>
                                            <Button
                                                variant="text"
                                                size="lg"
                                                height="auto"
                                                color={maxDepositColor}
                                                textTransform="uppercase"
                                                p={0}
                                                role="max-deposit-button"
                                                disabled={outputDeposit.eq(
                                                    balance && allowance
                                                )}
                                                onClick={() => {
                                                    setOutputDeposit(
                                                        balanceFormatted <
                                                            allowanceFormatted
                                                            ? balance
                                                            : allowance
                                                    );
                                                }}
                                            >
                                                Max deposit
                                            </Button>
                                        </Stack>
                                    </FormLabel>
                                    <CTSINumberInput
                                        value={formattedDepositValue}
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
                                        width="full"
                                        colorScheme={colorScheme}
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
                                        width="full"
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
