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
import { Operation } from '../../../types/stake';
import { CTSINumberInput } from '../CTSINumberInput';
import { useColorModeValue } from '../../ui/color-mode';
import CloseButton from '../../CloseButton';

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
    const radioColorScheme = useColorModeValue('teal', 'cyan');
    const colorScheme = useColorModeValue('teal', 'blue');
    const separatorColor = useColorModeValue('gray.100', 'gray.600');

    return (
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
                                Unstake to withdraw
                            </Box>
                        </Dialog.Title>
                    </Dialog.Header>
                    <Separator width="full" borderColor={separatorColor} />

                    <Dialog.Body mt={6}>
                        <VStack gap={5}>
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
                            <Field.Root id="amount">
                                <RadioGroup.Root
                                    defaultValue={unstakeFullAmount}
                                    name="unstakeAmount"
                                    width="full"
                                    onValueChange={({ value }) => {
                                        setUnstakeFullAmount(
                                            value as Operation
                                        );

                                        if (value === 'full') {
                                            setOutputUnstake(constants.Zero);
                                        } else {
                                            inputRef.current?.focus();
                                        }
                                    }}
                                >
                                    <Stack>
                                        <RadioGroup.Item
                                            value="full"
                                            colorPalette={radioColorScheme}
                                            _hover={{
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemIndicator />
                                            <RadioGroup.ItemText>
                                                Full amount
                                            </RadioGroup.ItemText>
                                        </RadioGroup.Item>

                                        <RadioGroup.Item
                                            value="partial"
                                            colorPalette={radioColorScheme}
                                            _hover={{
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemIndicator />
                                            <RadioGroup.ItemText>
                                                Partial amount
                                            </RadioGroup.ItemText>
                                        </RadioGroup.Item>

                                        <Collapsible.Root
                                            open={
                                                unstakeFullAmount === 'partial'
                                            }
                                            unmountOnExit
                                        >
                                            <Collapsible.Content>
                                                <Field.Root
                                                    id="unstakeAmount"
                                                    pl={7}
                                                >
                                                    <CTSINumberInput
                                                        min={0}
                                                        max={
                                                            stakeBalanceFormatted
                                                        }
                                                        onChange={(
                                                            bigNumberValue
                                                        ) => {
                                                            setOutputUnstake(
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
                                    colorPalette={colorScheme}
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
    );
};
