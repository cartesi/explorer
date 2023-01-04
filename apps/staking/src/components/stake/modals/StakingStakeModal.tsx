// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useEffect, useRef, useState } from 'react';
import {
    Button,
    FormControl,
    VStack,
    Text,
    FormHelperText,
    FormLabel,
    Modal,
    ModalCloseButton,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    Stack,
    UseDisclosureProps,
    Box,
    HStack,
    Divider,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { CTSINumberInput } from '../CTSINumberInput';

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
    const inputFocusRef = useRef();

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
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                initialFocusRef={inputFocusRef}
            >
                <ModalOverlay />
                <ModalContent>
                    <Box pb={6}>
                        <HStack justify="space-between">
                            <Box
                                fontSize="xl"
                                fontWeight="bold"
                                p={4}
                                pl={8}
                                pb={4}
                            >
                                Stake
                            </Box>

                            <ModalCloseButton mt="8px !important" />
                        </HStack>
                        <Divider />
                    </Box>
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                By moving your tokens from the pool balance to
                                your staked balance. Your staked tokens
                                contribute to the pool's staking power, which in
                                turn will automatically generate rewards. Learn
                                more
                            </Text>
                            <FormControl id="stakeAmount">
                                <FormLabel mr={0}>
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
                                            color="blue.400"
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
                                </FormLabel>
                                <CTSINumberInput
                                    value={formattedStakedValue}
                                    min={0}
                                    max={userBalanceFormatted}
                                    onChange={setStakedValue}
                                />
                                <FormHelperText>
                                    Allowance: {toCTSI(userBalance)} CTSI
                                </FormHelperText>
                            </FormControl>
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    width="full"
                                    colorScheme="blue"
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
                        </ModalFooter>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
