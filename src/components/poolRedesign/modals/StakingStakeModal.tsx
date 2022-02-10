// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Button,
    FormControl,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
    Text,
    FormHelperText,
    FormLabel,
    UseDisclosureProps,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC, useRef, useState } from 'react';
import { CTSINumberInput } from '../CTSINumberInput';

interface IStakingStakeModalProps {
    balance: BigNumber;
    userBalance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newStake: BigNumber) => void;
}

export const StakingStakeModal: FC<IStakingStakeModalProps> = ({
    userBalance,
    disclosure,
    isOpen: isOpen,
    onClose: onClose,
    onSave: onSave,
}) => {
    const userBalanceFormatted = parseFloat(formatUnits(userBalance, 18));
    const [outputStake, setOutputStake] = useState<BigNumber>(userBalance);

    const toCTSI = (value: BigNumber) => {
        // formatter for CTSI values
        const numberFormat = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });

        return numberFormat.format(parseFloat(formatUnits(value, 18)));
    };

    const inputFocusRef = useRef();
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
                    <ModalHeader>
                        Start staking by moving your tokens from the pool
                        balance to your staked balance.
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                Your staked tokens contribute to the pool's
                                staking power, which in turn will automatically
                                generate rewards.
                            </Text>
                            <FormControl id="stakeAmount">
                                <FormLabel fontWeight="bold">Amount</FormLabel>
                                <CTSINumberInput
                                    defaultValue={1}
                                    min={1}
                                    max={userBalanceFormatted}
                                    // ref={inputFocusRef}
                                    onChange={(bigNumberValue) => {
                                        setOutputStake(bigNumberValue);
                                    }}
                                />
                                <FormHelperText>
                                    Max. available: {toCTSI(userBalance)} CTSI
                                </FormHelperText>
                            </FormControl>
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    isFullWidth
                                    colorScheme="darkGray"
                                    onClick={() => {
                                        console.log(toCTSI(outputStake));
                                        onSave(outputStake);
                                        disclosure.onClose();
                                        onClose();
                                    }}
                                >
                                    Stake
                                </Button>
                                <Button
                                    isFullWidth
                                    variant="outline"
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
