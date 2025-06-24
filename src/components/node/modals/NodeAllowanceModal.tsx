// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

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
    VStack,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { FC, useState } from 'react';
import { CTSINumberInput } from '../../stake/CTSINumberInput';
import { useColorModeValue } from '../../ui/color-mode';
import CloseButton from '../../CloseButton';

interface INodeAllowanceModalProps {
    allowance: BigNumber;
    balance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newAllowance: BigNumber) => void;
}

export const NodeAllowanceModal: FC<INodeAllowanceModalProps> = ({
    allowance,
    balance,
    disclosure,
    isOpen: isOpen,
    onClose: onClose,
    onSave: onSave,
}) => {
    const allowanceFormatted = parseFloat(formatUnits(allowance, 18));
    const balanceFormatted = parseFloat(formatUnits(balance, 18));
    const bgModal = useColorModeValue('white', 'dark.gray.quaternary');
    const color = useColorModeValue('dark.primary.gray', 'white');
    const borderColor = useColorModeValue('dark.gray.gray.primary', 'white');
    const colorScheme = useColorModeValue('teal', 'cyan');
    const separatorColor = useColorModeValue('gray.100', 'gray.600');
    const inputHelperTextColor = useColorModeValue(undefined, 'gray.300');

    const [outputAllowance, setOutputAllowance] =
        useState<BigNumber>(allowance);

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
                <Dialog.Content
                    bg={bgModal}
                    border="1px solid"
                    borderColor={'dark.border.secondary'}
                    borderRadius={'2xl'}
                    color={color}
                >
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                    <Dialog.Header>
                        <Dialog.Title>
                            <Box fontSize="xl" fontWeight="bold">
                                Set allowance
                            </Box>
                        </Dialog.Title>
                    </Dialog.Header>
                    <Separator width="full" borderColor={separatorColor} />

                    <Dialog.Body mt={6}>
                        <VStack gap={5}>
                            <Text>
                                This is going to be the maximum amount of CTSI
                                that Cartesi’s staking contract will be able to
                                receive from your personal account. Please enter
                                the total value you wish to allow the CTSI
                                staking contract to hold.
                            </Text>
                            <Field.Root id="depositAmount">
                                <Field.Label fontWeight="bold">
                                    Allowance amount
                                </Field.Label>
                                <CTSINumberInput
                                    value={allowanceFormatted}
                                    min={0}
                                    onChange={(bigNumberValue) => {
                                        setOutputAllowance(bigNumberValue);
                                    }}
                                />
                                <Field.HelperText color={inputHelperTextColor}>
                                    In this case, each edit will cost your ETH
                                    gas fee.
                                </Field.HelperText>
                            </Field.Root>
                        </VStack>
                    </Dialog.Body>
                    <Dialog.Footer pt={10}>
                        <VStack w="full" gap={4}>
                            <Button
                                width="full"
                                colorPalette={colorScheme}
                                onClick={() => {
                                    onSave(outputAllowance);
                                    disclosure.onClose();
                                    onClose();
                                }}
                            >
                                Approve
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
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};
