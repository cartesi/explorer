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
    Dialog,
    Field,
    HStack,
    Link,
    Separator,
    Text,
    UseDisclosureProps,
    VStack,
} from '@chakra-ui/react';
import { BigNumber, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { FC, useEffect, useState } from 'react';
import { CTSINumberInput } from '../../stake/CTSINumberInput';
import { useColorModeValue } from '../../ui/color-mode';

interface INodeUnstakeModalProps {
    stakedBalance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newStake: BigNumber) => void;
}

export const NodeUnstakeModal: FC<INodeUnstakeModalProps> = ({
    stakedBalance,
    disclosure,
    isOpen: isOpen,
    onClose: onClose,
    onSave: onSave,
}) => {
    if (!stakedBalance) return null;

    const maxUnstakeFormatted = parseFloat(formatUnits(stakedBalance, 18));
    const [outputStake, setOutputStake] = useState<BigNumber>(stakedBalance);
    const [stakedValue, setStakedValue] = useState<any>(0);
    const colorScheme = useColorModeValue('teal', 'cyan');

    const toCTSI = (value: BigNumber) => {
        // formatter for CTSI values
        const numberFormat = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });

        return numberFormat.format(parseFloat(formatUnits(value, 18)));
    };

    const bgModal = useColorModeValue('white', 'dark.gray.quaternary');
    const color = useColorModeValue('dark.primary.gray', 'white');

    useEffect(() => {
        if (!isOpen) {
            setStakedValue(0);
            setOutputStake(constants.Zero);
        }
    }, [isOpen]);

    const handleMaxUnstake = () => {
        setStakedValue(parseFloat(formatUnits(stakedBalance, 18)));
        setOutputStake(stakedBalance);
    };

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
                            <Box
                                fontSize="xl"
                                fontWeight="bold"
                                p={4}
                                pl={8}
                                pb={4}
                            >
                                Unstake
                            </Box>
                        </Dialog.Title>
                        <Separator />
                    </Dialog.Header>
                    <Dialog.Body>
                        <VStack gap={5}>
                            <Text>
                                Bear in mind that your funds take 48 hours to
                                become unlocked. Be careful if you want to
                                unstake more funds while you have a non-zero
                                “Releasing” balance. In that case, the timer
                                restarts with the new unstaking funds added to
                                the previously “Releasing” balance. Learn more
                            </Text>
                            <Field.Root id="stakeAmount">
                                <HStack justify="space-between">
                                    <Field.Label fontWeight="bold">
                                        Unstake Amount
                                    </Field.Label>
                                    <Link
                                        color={colorScheme}
                                        _hover={{
                                            color: colorScheme,
                                        }}
                                        pb={2}
                                        onClick={handleMaxUnstake}
                                    >
                                        MAX UNSTAKE
                                    </Link>
                                </HStack>
                                <CTSINumberInput
                                    value={stakedValue}
                                    max={maxUnstakeFormatted}
                                    onChange={(bigNumberValue) => {
                                        setOutputStake(bigNumberValue);
                                    }}
                                />
                                <Field.HelperText>
                                    Staked Balance: {toCTSI(stakedBalance)} CTSI
                                </Field.HelperText>
                            </Field.Root>
                        </VStack>
                        <Dialog.Footer px="0" pt={10}>
                            <VStack w="full" gap={4}>
                                <Dialog.ActionTrigger asChild>
                                    <Button
                                        width="full"
                                        colorScheme={colorScheme}
                                        disabled={outputStake.isZero()}
                                        onClick={() => {
                                            onSave(outputStake);
                                            disclosure.onClose();
                                            onClose();
                                        }}
                                    >
                                        UNSTAKE
                                    </Button>
                                </Dialog.ActionTrigger>
                                <Dialog.CloseTrigger asChild>
                                    <Button
                                        width="full"
                                        colorScheme="darkGray"
                                        variant="ghost"
                                        onClick={onClose}
                                    >
                                        CANCEL
                                    </Button>
                                </Dialog.CloseTrigger>
                            </VStack>
                        </Dialog.Footer>
                    </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};
