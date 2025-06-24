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
    Separator,
    Text,
    UseDisclosureProps,
    useToken,
    VStack,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC, useState } from 'react';
import { CTSINumberInput } from '../CTSINumberInput';
import { useColorModeValue } from '../../ui/color-mode';
import CloseButton from '../../CloseButton';

export interface IStakingPoolAllowanceModalProps {
    allowance: BigNumber;
    balance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newAllowance: BigNumber) => void;
}

export const StakingPoolAllowanceModal: FC<IStakingPoolAllowanceModalProps> = ({
    allowance,
    balance,
    disclosure,
    isOpen,
    onClose,
    onSave,
}) => {
    const allowanceFormatted = parseFloat(formatUnits(allowance, 18));
    const balanceFormatted = parseFloat(formatUnits(balance, 18));
    const buttonColorScheme = useColorModeValue('teal', 'cyan');
    const [formControlColor] = useToken('colors', ['form-control-color']);
    const helperTextColor = useColorModeValue(formControlColor, 'white');
    const separatorColor = useColorModeValue('gray.100', 'gray.600');

    const [outputAllowance, setOutputAllowance] =
        useState<BigNumber>(allowance);

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
                                    Edit pool allowance
                                </Box>
                            </Dialog.Title>
                        </Dialog.Header>
                        <Separator width="full" borderColor={separatorColor} />

                        <Dialog.Body mt={6}>
                            <VStack gap={5}>
                                <Text>
                                    Additional layer of protection with a max
                                    amount of CTSI tokens that this pool can
                                    transfer from your wallet.
                                </Text>
                                <Field.Root id="depositAmount">
                                    <Field.Label fontWeight="bold">
                                        Pool allowance
                                    </Field.Label>
                                    <CTSINumberInput
                                        value={allowanceFormatted}
                                        min={0}
                                        onChange={(bigNumberValue) => {
                                            setOutputAllowance(bigNumberValue);
                                        }}
                                    />
                                    <Field.HelperText color={helperTextColor}>
                                        The Pool Allowance can be edited at any
                                        time. Each edit is charged in the form
                                        of a gas fee like any Ethereum
                                        transaction.
                                    </Field.HelperText>
                                </Field.Root>
                            </VStack>
                            <Dialog.Footer px="0" pt={10}>
                                <VStack w="full" gap={4}>
                                    <Button
                                        width="full"
                                        colorPalette={buttonColorScheme}
                                        onClick={() => {
                                            onSave(outputAllowance);
                                            disclosure.onClose();
                                            onClose();
                                        }}
                                    >
                                        Save
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
