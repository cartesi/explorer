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
    Input,
    InputGroup,
    Separator,
    Text,
    UseDisclosureProps,
    VStack,
} from '@chakra-ui/react';
import { BigNumber, constants, ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { FC, useEffect, useState } from 'react';
import { useColorModeValue } from '../../ui/color-mode';

interface INodeBalanceModalProps {
    userBalance: BigNumber;
    disclosure: UseDisclosureProps;
    onDepositFunds: (funds: BigNumber) => void;
}

export const NodeBalanceModal: FC<INodeBalanceModalProps> = ({
    userBalance,
    disclosure,
    onDepositFunds,
}) => {
    const { open, onClose } = disclosure;
    const [output, setOutput] = useState<BigNumber>(constants.Zero);
    const [fundsValue, setFundsValue] = useState<any>(0);

    const bgModal = useColorModeValue('white', 'dark.gray.quaternary');
    const color = useColorModeValue('dark.primary.gray', 'white');
    const colorScheme = useColorModeValue('teal', 'cyan');

    const toBigNumber = (value: number, decimals = 18) =>
        ethers.utils.parseUnits(value.toString(), decimals);

    const toETH = (value: BigNumber) => {
        const options: Intl.NumberFormatOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
        };

        const numberFormat = new Intl.NumberFormat('en-US', options);
        const valueFormatted = numberFormat.format(
            value ? parseFloat(formatUnits(value, 18)) : 0
        );

        return valueFormatted;
    };

    const userETHBalance = toETH(userBalance ?? constants.Zero);

    useEffect(() => {
        if (!open) {
            setFundsValue(0);
            setOutput(constants.Zero);
        }
    }, [open]);

    useEffect(() => {
        try {
            const funds = parseFloat(fundsValue);
            setOutput(toBigNumber(funds)); // ETH float to BigNumber
        } catch {
            setOutput(constants.Zero);
        }
    }, [fundsValue]);

    return (
        <Dialog.Root
            open={open}
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
                                Node balance
                            </Box>
                        </Dialog.Title>
                    </Dialog.Header>
                    <Separator />
                    <Dialog.Body>
                        <VStack gap={5}>
                            <Text>
                                You incur transaction fee expenses when you are
                                rewarded with CTSI. Expect to spend around
                                120,000 gas every time your node produces a
                                block.
                            </Text>
                            <Field.Root id="stakeAmount">
                                <HStack justify="space-between">
                                    <Field.Label fontWeight="bold">
                                        Node balance
                                    </Field.Label>
                                </HStack>
                                <InputGroup
                                    endElement={<Box color="gray.300">ETH</Box>}
                                >
                                    <Input
                                        value={fundsValue}
                                        onChange={(e) =>
                                            setFundsValue(e.target.value)
                                        }
                                    />
                                </InputGroup>
                                <Field.HelperText>
                                    Your balance: {userETHBalance} ETH
                                </Field.HelperText>
                            </Field.Root>
                        </VStack>
                        <Dialog.Footer px="0" pt={10}>
                            <VStack w="full" gap={4}>
                                <Button
                                    width="full"
                                    colorScheme={colorScheme}
                                    disabled={
                                        output.isZero() ||
                                        output.gt(userBalance)
                                    }
                                    onClick={() => {
                                        onDepositFunds(output);
                                        disclosure.onClose();
                                        onClose();
                                    }}
                                >
                                    Add funds
                                </Button>
                                <Button
                                    width="full"
                                    colorScheme="darkGray"
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
