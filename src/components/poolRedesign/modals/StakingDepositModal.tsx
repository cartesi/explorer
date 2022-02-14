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
import React, { FC, useRef, useState } from 'react';
import { BigNumber, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { CTSINumberInput } from '../CTSINumberInput';

interface IStakingDepositModalProps {
    allowance: BigNumber;
    balance: BigNumber;
    disclosure: UseDisclosureProps;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newDeposit: BigNumber) => void;
}

const toCTSI = (value: BigNumber) => {
    return parseFloat(formatUnits(value, 18));
};

export const StakingDepositModal: FC<IStakingDepositModalProps> = ({
    allowance,
    balance,
    disclosure,
    isOpen: isOpen,
    onClose: onClose,
    onSave: onSave,
}) => {
    const allowanceFormatted = parseFloat(formatUnits(allowance, 18));
    const [outputDeposit, setOutputDeposit] = useState<BigNumber>(
        constants.Zero
    );

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
                    <ModalHeader>Deposit in pool balance</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                The Pool Balance is a transitory account where
                                your tokens are temporarily held before they can
                                be staked. This allows Cartesi to verify the
                                transaction as a precautionary measure to
                                increase security. The holding period last
                                usually for 6 hours. However, a high volume of
                                requests may result in a longer holding time.
                            </Text>
                            <FormControl id="depositAmount">
                                <FormLabel fontWeight="bold">Amount</FormLabel>
                                <CTSINumberInput
                                    defaultValue={0}
                                    min={0}
                                    max={allowanceFormatted}
                                    // ref={inputFocusRef}
                                    onChange={(bigNumberValue) => {
                                        setOutputDeposit(bigNumberValue);
                                    }}
                                />
                                <FormHelperText>
                                    Max. available/allowance:{' '}
                                    {allowance.gte(balance)
                                        ? toCTSI(balance)
                                        : toCTSI(allowance)}{' '}
                                    CTSI
                                </FormHelperText>
                            </FormControl>
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    isFullWidth
                                    colorScheme="darkGray"
                                    disabled={outputDeposit.isZero()}
                                    onClick={() => {
                                        onSave(outputDeposit);
                                        disclosure.onClose();
                                        onClose();
                                    }}
                                >
                                    Deposit
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
