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
    Dialog,
    Field,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    Separator,
    Stack,
    Tag,
    Text,
    UseDisclosureProps,
    VStack,
} from '@chakra-ui/react';
import { BigNumber, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC, useEffect, useState } from 'react';
import { CheckCircleIcon, PencilIconWhite } from '../../Icons';
import CTSI from '../../pools/staking/CTSI';
import { CTSINumberInput } from '../CTSINumberInput';
import { useColorModeValue } from '../../ui/color-mode';
import { Tooltip } from '../../Tooltip';
import { TbHelp } from 'react-icons/tb';
import CloseButton from '../../CloseButton';

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
    const tagColor = useColorModeValue('gray.900', 'white');
    const infoBg = useColorModeValue('dark.gray.senary', 'dark.gray.tertiary');
    const infoColor = useColorModeValue('black', 'white');
    const checkIconBg = useColorModeValue('dark.gray.senary', 'white');
    const colorScheme = useColorModeValue('teal', 'blue');
    const iconColor = useColorModeValue('gray.900', 'white');
    const separatorColor = useColorModeValue('gray.100', 'gray.600');
    const inputHelperTextColor = useColorModeValue(undefined, 'gray.300');

    useEffect(() => {
        if (!isOpen) {
            setOutputDeposit(BigNumber.from(0));
        }
    }, [isOpen]);

    return (
        <Dialog.Root
            size={'md'}
            open={isOpen}
            placement="center"
            onOpenChange={({ open }) => {
                if (!open) {
                    onClose();
                    setAllowanceStep(false);
                }
            }}
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content borderRadius="0" p={0} minH="610px">
                    {allowance.isZero() || allowanceStep ? (
                        <>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                            <Dialog.Header>
                                <Dialog.Title>
                                    <Box fontSize="xl" fontWeight="bold">
                                        Deposit
                                    </Box>
                                </Dialog.Title>
                            </Dialog.Header>
                            <Separator
                                width="full"
                                borderColor={separatorColor}
                            />

                            <Dialog.Body mt={6}>
                                <VStack gap={5}>
                                    <HStack w="full" gap={4}>
                                        <Box
                                            flexGrow="0"
                                            display="flex"
                                            alignItems="center"
                                        >
                                            <Icon
                                                as={CheckCircleIcon}
                                                w={5}
                                                h={5}
                                                mr={1}
                                            />
                                            <Tag.Root
                                                bg="transparent"
                                                boxShadow="none"
                                            >
                                                <Tag.Label
                                                    fontSize="lg"
                                                    fontWeight="normal"
                                                    color={tagColor}
                                                >
                                                    Set Allowance
                                                </Tag.Label>
                                            </Tag.Root>
                                        </Box>
                                        <Box alignSelf="center">
                                            <Separator
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
                                            <Icon
                                                as={CheckCircleIcon}
                                                w={5}
                                                h={5}
                                                mr={1}
                                                color="gray.300"
                                                pointerEvents="none"
                                            />
                                            <Tag.Root
                                                bg="transparent"
                                                boxShadow="none"
                                            >
                                                <Tag.Label
                                                    fontSize="lg"
                                                    fontWeight="normal"
                                                    color={tagColor}
                                                    pointerEvents="none"
                                                >
                                                    Deposit
                                                </Tag.Label>
                                            </Tag.Root>
                                        </Box>
                                    </HStack>
                                    <Text>
                                        Set the desired allowance. It is the
                                        total accrued amount of CTSI the pool is
                                        allowed to stake for you. This number
                                        should be equal or larger that the CTSI
                                        you plan to stake.
                                    </Text>
                                    <Field.Root id="depositAmount">
                                        <Field.Label fontWeight="bold">
                                            Allowance Amount
                                        </Field.Label>
                                        <CTSINumberInput
                                            min={0}
                                            onChange={(bigNumberValue) => {
                                                setOutputAllowance(
                                                    bigNumberValue
                                                );
                                            }}
                                        />
                                        <Field.HelperText
                                            color={inputHelperTextColor}
                                        >
                                            First time setting will cost ETH gas
                                            fee. It will display in the wallet
                                            transaction.
                                        </Field.HelperText>
                                    </Field.Root>
                                </VStack>
                                <Dialog.Footer px="0">
                                    <VStack w="full">
                                        <Button
                                            width="full"
                                            colorPalette={colorScheme}
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
                                </Dialog.Footer>
                            </Dialog.Body>
                        </>
                    ) : (
                        <>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                            <Dialog.Header>
                                <Dialog.Title>
                                    <Box fontSize="xl" fontWeight="bold">
                                        Deposit
                                    </Box>
                                </Dialog.Title>
                            </Dialog.Header>
                            <Separator
                                width="full"
                                borderColor={separatorColor}
                            />

                            <Dialog.Body pt={6}>
                                <VStack gap={5}>
                                    <HStack w="full" gap={4}>
                                        <Box flexGrow="0">
                                            <Icon
                                                as={CheckCircleIcon}
                                                w={5}
                                                h={5}
                                                bgColor={checkIconBg}
                                                borderRadius="full"
                                                color="black"
                                            />
                                            <Tag.Root
                                                bg="transparent"
                                                boxShadow="none"
                                            >
                                                <Tag.Label
                                                    fontSize="lg"
                                                    fontWeight="normal"
                                                >
                                                    Set Allowance
                                                </Tag.Label>
                                            </Tag.Root>
                                        </Box>
                                        <Box alignSelf="center">
                                            <Separator
                                                orientation="horizontal"
                                                w={12}
                                                borderColor={color}
                                            />
                                        </Box>
                                        <Box flexGrow="1">
                                            <Icon
                                                as={CheckCircleIcon}
                                                w={5}
                                                h={5}
                                            />
                                            <Tag.Root
                                                bg="transparent"
                                                boxShadow="none"
                                            >
                                                <Tag.Label
                                                    fontSize="lg"
                                                    fontWeight="normal"
                                                >
                                                    Deposit
                                                </Tag.Label>
                                            </Tag.Root>
                                        </Box>
                                    </HStack>

                                    <Text>
                                        You can deposit any amount of token to
                                        the pool as far as you have the tokens
                                        amount is lower than the set allowance.
                                        As a safety precaution, the average
                                        waiting time is 6 hours.
                                    </Text>

                                    <HStack
                                        w="full"
                                        gap={4}
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
                                                    showArrow
                                                    content="Here you can see your current pool allowance."
                                                    positioning={{
                                                        placement: 'top',
                                                    }}
                                                    openDelay={0}
                                                >
                                                    <Icon
                                                        as={TbHelp}
                                                        w={3.5}
                                                        h={3.5}
                                                    />
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
                                                h={10}
                                                w={10}
                                                bg="transparent"
                                                onClick={() => {
                                                    setAllowanceStep(true);
                                                }}
                                            >
                                                <Icon
                                                    as={PencilIconWhite}
                                                    w={6}
                                                    h={6}
                                                    color={iconColor}
                                                />
                                            </IconButton>
                                        </Box>
                                    </HStack>

                                    <Box>
                                        <Text fontSize="xs">
                                            It is the total accrued amount of
                                            CTSI the pool is allowed to stake
                                            for you. Each edit will cost ETH gas
                                            fee.
                                        </Text>
                                    </Box>

                                    <Field.Root id="depositAmount">
                                        <Field.Label mr={0} width="full">
                                            <Stack
                                                direction="row"
                                                justify="space-between"
                                                alignItems="center"
                                                width="full"
                                            >
                                                <span
                                                    style={{
                                                        fontWeight: 'bold',
                                                    }}
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
                                        </Field.Label>
                                        <CTSINumberInput
                                            value={formattedDepositValue}
                                            min={0}
                                            max={allowanceFormatted}
                                            onChange={(bigNumberValue) => {
                                                setOutputDeposit(
                                                    bigNumberValue
                                                );
                                            }}
                                        />
                                        <Field.HelperText
                                            color={inputHelperTextColor}
                                        >
                                            <Flex align="baseline">
                                                <Text mr="1">
                                                    Wallet balance:
                                                </Text>

                                                <CTSI
                                                    value={balance}
                                                    fontSize="sm"
                                                />

                                                <Text ml="1">CTSI</Text>
                                            </Flex>
                                        </Field.HelperText>
                                    </Field.Root>
                                </VStack>
                                <Dialog.Footer px="0" pt={10}>
                                    <VStack w="full" gap={4}>
                                        <Button
                                            width="full"
                                            colorPalette={colorScheme}
                                            disabled={outputDeposit.isZero()}
                                            role="deposit-button"
                                            onClick={() => {
                                                onSave(
                                                    outputDeposit,
                                                    'deposit'
                                                );
                                                disclosure.onClose();
                                                onClose();
                                            }}
                                        >
                                            Deposit
                                        </Button>
                                        <Button
                                            width="full"
                                            variant="ghost"
                                            colorPalette="gray"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </Button>
                                    </VStack>
                                </Dialog.Footer>
                            </Dialog.Body>
                        </>
                    )}
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};
