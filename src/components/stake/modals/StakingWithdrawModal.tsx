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
    CloseButton,
    Collapsible,
    Dialog,
    Field,
    RadioGroup,
    Separator,
    Stack,
    Text,
    UseDisclosureProps,
    VStack,
} from '@chakra-ui/react';
import { BigNumber, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC, useRef, useState } from 'react';
import { CTSINumberInput } from '../CTSINumberInput';
import { useColorModeValue } from '../../ui/color-mode';

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

    const userBalanceFormatted = parseFloat(formatUnits(userBalance, 18));
    const [outputWithdraw, setOutputWithdraw] = useState<BigNumber>(
        constants.Zero
    );
    const radioColorScheme = useColorModeValue('teal', 'cyan');
    const colorScheme = useColorModeValue('teal', 'blue');

    return (
        <>
            <Dialog.Root
                open={isOpen}
                placement="center"
                onOpenChange={({ open }) => {
                    if (!open) {
                        onClose();
                    }
                }}
            >
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                        <Dialog.Header>
                            <Dialog.Title>
                                <Box fontSize="xl" fontWeight="bold">
                                    Withdraw from the pool balance to your
                                    wallet
                                </Box>
                            </Dialog.Title>
                        </Dialog.Header>
                        <Separator width="full" />

                        <Dialog.Body>
                            <VStack gap={5}>
                                <Text>
                                    Last step to receive tokens in your wallet!
                                    Depending on the volume of requests, this
                                    process can take up to 96 hours.
                                </Text>

                                <Text>
                                    Please return to complete your withdrawal at
                                    the end of the specified waiting period to
                                    avoid further delays.
                                </Text>
                                <Field.Root id="amount">
                                    <RadioGroup.Root
                                        defaultValue={withdrawFullAmount}
                                        name="unstakeAmount"
                                        colorPalette={radioColorScheme}
                                        onValueChange={({ value }) => {
                                            setWithdrawFullAmount(value);

                                            if (value === 'partial') {
                                                setOutputWithdraw(
                                                    constants.Zero
                                                );
                                                inputRef.current?.focus();
                                            }
                                        }}
                                    >
                                        <Stack>
                                            <RadioGroup.Item
                                                value="full"
                                                colorScheme={radioColorScheme}
                                            >
                                                Full amount
                                            </RadioGroup.Item>

                                            <RadioGroup.Item
                                                value="partial"
                                                colorScheme={radioColorScheme}
                                            >
                                                Partial amount
                                            </RadioGroup.Item>

                                            <Collapsible.Root
                                                open={
                                                    withdrawFullAmount ===
                                                    'partial'
                                                }
                                                unmountOnExit
                                            >
                                                <Collapsible.Content>
                                                    <Field.Root
                                                        id="withdrawAmount"
                                                        pl={7}
                                                    >
                                                        <CTSINumberInput
                                                            min={0}
                                                            max={
                                                                userBalanceFormatted
                                                            }
                                                            onChange={(
                                                                bigNumberValue
                                                            ) => {
                                                                setOutputWithdraw(
                                                                    bigNumberValue
                                                                );
                                                            }}
                                                        />
                                                    </Field.Root>
                                                </Collapsible.Content>
                                            </Collapsible.Root>
                                        </Stack>
                                    </RadioGroup.Root>
                                </Field.Root>
                            </VStack>
                            <Dialog.Footer px="0" pt={10}>
                                <VStack w="full" gap={4}>
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
                                        colorPalette="gray"
                                        variant="ghost"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                </VStack>
                            </Dialog.Footer>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    );
};
