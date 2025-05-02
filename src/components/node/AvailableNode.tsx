// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    HStack,
    Stack,
    Text,
    VStack,
    Input,
    InputGroup,
    InputRightAddon,
} from '@chakra-ui/react';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useForm } from 'react-hook-form';
import { BigNumberText } from '../CTSIText';

type AvailableNodeProps = {
    balance: BigNumber; // user ETH balance
    onHire: (deposit: BigNumberish) => void;
};

const AvailableNode: FC<AvailableNodeProps> = ({ balance, onHire }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ deposit: number }>();

    const toBigNumber = (value: number, decimals = 18) =>
        ethers.utils.parseUnits(value.toString(), decimals);

    const validate = (value: number) => {
        if (value <= 0) {
            return 'Value must be greater than 0';
        } else if (toBigNumber(value).gt(balance)) {
            return 'Insufficient ETH balance';
        }
        return true;
    };

    return (
        <VStack align="stretch">
            <Stack
                direction={['column', 'column', 'column', 'row']}
                spacing={[4, 4, 4, 8]}
                align={[undefined, undefined, undefined, 'center']}
            >
                <BigNumberText
                    value={balance}
                    unit="eth"
                    color={errors.deposit ? 'red' : undefined}
                    alignSelf="flex-start"
                >
                    <Text>Your Balance</Text>
                </BigNumberText>
                <FormControl isInvalid={!!errors.deposit} w={300}>
                    <FormLabel>Deposit</FormLabel>
                    <InputGroup>
                        <Input
                            w={100}
                            {...register('deposit', {
                                required: true,
                                valueAsNumber: true,
                                validate: validate,
                            })}
                        />
                        <InputRightAddon>ETH</InputRightAddon>
                    </InputGroup>
                    {!errors.deposit && (
                        <FormHelperText>
                            Amount of ETH to transfer to node on hire
                        </FormHelperText>
                    )}
                    <FormErrorMessage>
                        {errors.deposit?.message}
                    </FormErrorMessage>
                </FormControl>
            </Stack>
            <HStack>
                <Button
                    colorPalette="blue"
                    width="full"
                    onClick={handleSubmit((data) =>
                        onHire(toBigNumber(data.deposit))
                    )}
                >
                    Hire Node
                </Button>
            </HStack>
        </VStack>
    );
};

export default AvailableNode;
