// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    Field,
    Separator,
    Stack,
    Text,
    UseDisclosureProps,
    VStack,
} from '@chakra-ui/react';
import { formatUnits } from 'viem';
import { CTSINumberInput } from '../CTSINumberInput';
import { useColorModeValue } from '../../ui/color-mode';
import CloseButton from '../../CloseButton';

export interface IStakingStakeModalProps {
    balance: bigint;
    userBalance: bigint;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newStake: bigint) => void;
}

const formatBigNumber = (value: bigint) => parseFloat(formatUnits(value, 18));

export const StakingStakeModal: FC<IStakingStakeModalProps> = ({
    userBalance,
    disclosure,
    isOpen,
    onClose,
    onSave,
}) => {
    const userBalanceFormatted = formatBigNumber(userBalance);
    const [stakedValue, setStakedValue] = useState<bigint>(0n);
    const formattedStakedValue = formatBigNumber(stakedValue);
    const maxStakeColor = useColorModeValue('dark.secondary', 'dark.primary');
    const helperTextColor = useColorModeValue('gray.600', 'white');
    const colorScheme = useColorModeValue('teal', 'blue');
    const separatorColor = useColorModeValue('gray.100', 'gray.600');

    const toCTSI = (value: bigint) => {
        // formatter for CTSI values
        const numberFormat = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });

        return numberFormat.format(formatBigNumber(value));
    };

    useEffect(() => {
        if (!isOpen) {
            setStakedValue(0n);
        }
    }, [isOpen]);

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
                                Stake
                            </Box>
                        </Dialog.Title>
                    </Dialog.Header>
                    <Separator width="full" borderColor={separatorColor} />

                    <Dialog.Body mt={6}>
                        <VStack gap={5}>
                            <Text>
                                By moving your tokens from the pool balance to
                                your staked balance. Your staked tokens
                                contribute to the pool's staking power, which in
                                turn will automatically generate rewards. Learn
                                more
                            </Text>
                            <Field.Root id="stakeAmount">
                                <Field.Label mr={0} width="full">
                                    <Stack
                                        direction="row"
                                        justify="space-between"
                                        alignItems="center"
                                        width="full"
                                    >
                                        <span>Stake Amount</span>
                                        <Button
                                            variant="text"
                                            size="md"
                                            height="auto"
                                            color={maxStakeColor}
                                            textTransform="uppercase"
                                            p={0}
                                            data-testid="max-stake-button"
                                            disabled={
                                                stakedValue === userBalance
                                            }
                                            onClick={() => {
                                                setStakedValue(userBalance);
                                            }}
                                        >
                                            Max stake
                                        </Button>
                                    </Stack>
                                </Field.Label>
                                <CTSINumberInput
                                    value={formattedStakedValue}
                                    min={0}
                                    max={userBalanceFormatted}
                                    onChange={setStakedValue}
                                />
                                <Field.HelperText color={helperTextColor}>
                                    Allowance: {toCTSI(userBalance)} CTSI
                                </Field.HelperText>
                            </Field.Root>
                        </VStack>
                        <Dialog.Footer px="0" pt={10}>
                            <VStack w="full" gap={4}>
                                <Button
                                    width="full"
                                    colorPalette={colorScheme}
                                    disabled={stakedValue === 0n}
                                    data-testid="stake-button"
                                    onClick={() => {
                                        onSave(stakedValue);
                                        disclosure.onClose();
                                        onClose();
                                    }}
                                >
                                    Stake
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
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};
