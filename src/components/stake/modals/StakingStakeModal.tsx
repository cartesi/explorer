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
    CloseButton,
    Dialog,
    Field,
    Separator,
    Stack,
    Text,
    UseDisclosureProps,
    VStack,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { CTSINumberInput } from '../CTSINumberInput';
import { useColorModeValue } from '../../ui/color-mode';

export interface IStakingStakeModalProps {
    balance: BigNumber;
    userBalance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newStake: BigNumber) => void;
}

const formatBigNumber = (value: BigNumber) =>
    parseFloat(formatUnits(value, 18));

export const StakingStakeModal: FC<IStakingStakeModalProps> = ({
    userBalance,
    disclosure,
    isOpen,
    onClose,
    onSave,
}) => {
    const userBalanceFormatted = formatBigNumber(userBalance);
    const [stakedValue, setStakedValue] = useState<BigNumber>(
        BigNumber.from(0)
    );
    const formattedStakedValue = formatBigNumber(stakedValue);
    const maxStakeColor = useColorModeValue('dark.secondary', 'dark.primary');
    const helperTextColor = useColorModeValue('gray.600', 'white');
    const colorScheme = useColorModeValue('teal', 'blue');

    const toCTSI = (value: BigNumber) => {
        // formatter for CTSI values
        const numberFormat = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });

        return numberFormat.format(formatBigNumber(value));
    };

    useEffect(() => {
        if (!isOpen) {
            setStakedValue(BigNumber.from(0));
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
                    <Separator width="full" />

                    <Dialog.Body>
                        <VStack gap={5}>
                            <Text>
                                By moving your tokens from the pool balance to
                                your staked balance. Your staked tokens
                                contribute to the pool's staking power, which in
                                turn will automatically generate rewards. Learn
                                more
                            </Text>
                            <Field.Root id="stakeAmount">
                                <Field.Label mr={0}>
                                    <Stack
                                        direction="row"
                                        justify="space-between"
                                        alignItems="center"
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
                                            disabled={stakedValue.eq(
                                                userBalance
                                            )}
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
                                    colorScheme={colorScheme}
                                    disabled={stakedValue.isZero()}
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
                                    colorScheme="darkGray"
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
