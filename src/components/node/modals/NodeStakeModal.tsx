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

interface INodeStakeModalProps {
    allowance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newStake: BigNumber) => void;
}

export const NodeStakeModal: FC<INodeStakeModalProps> = ({
    allowance,
    disclosure,
    isOpen: isOpen,
    onClose: onClose,
    onSave: onSave,
}) => {
    if (!allowance) return null;

    const maxAllowanceFormatted = parseFloat(formatUnits(allowance, 18));
    const [outputStake, setOutputStake] = useState<BigNumber>(allowance);
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

    const handleMaxStake = () => {
        setStakedValue(parseFloat(formatUnits(allowance, 18)));
        setOutputStake(allowance);
    };

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
                                    Stake
                                </Box>
                            </Dialog.Title>
                        </Dialog.Header>
                        <Separator />
                        <Dialog.Body>
                            <VStack gap={5}>
                                <Text>
                                    The funds you stake will go to a maturing
                                    state. It takes hours for your staking to
                                    achieve maturity. You will see them in the
                                    “Maturing” bar with a countdown timer. Learn
                                    more
                                </Text>
                                <Field.Root id="stakeAmount">
                                    <HStack justify="space-between">
                                        <Field.Label fontWeight="bold">
                                            Stake Amount
                                        </Field.Label>
                                        <Link
                                            color={colorScheme}
                                            _hover={{
                                                color: colorScheme,
                                            }}
                                            pb={2}
                                            onClick={handleMaxStake}
                                        >
                                            MAX STAKE
                                        </Link>
                                    </HStack>
                                    <CTSINumberInput
                                        value={stakedValue}
                                        min={0}
                                        max={maxAllowanceFormatted}
                                        onChange={(bigNumberValue) => {
                                            setOutputStake(bigNumberValue);
                                        }}
                                    />
                                    <Field.HelperText>
                                        Allowance: {toCTSI(allowance)} CTSI
                                    </Field.HelperText>
                                </Field.Root>
                            </VStack>
                            <Dialog.Footer px="0" pt={10}>
                                <VStack w="full" gap={4}>
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
                                        STAKE
                                    </Button>
                                    <Button
                                        width="full"
                                        colorScheme="darkGray"
                                        variant="ghost"
                                        onClick={onClose}
                                    >
                                        CANCEL
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
