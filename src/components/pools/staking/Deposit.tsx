// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import {
    FormControl,
    FormErrorMessage,
    HStack,
    IconButton,
    Input,
    Text,
    Tooltip,
    Stack,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { MdAdd } from 'react-icons/md';
import Title from './Title';

export interface DepositProps {
    allowance: BigNumber;
    balance: BigNumber;
    onCancel: () => void;
    onSubmit: (value: BigNumberish) => void;
}

const Deposit: FC<DepositProps> = ({
    allowance,
    balance,
    onCancel,
    onSubmit,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ deposit: number }>({
        defaultValues: {
            deposit: Math.min(
                parseFloat(formatUnits(allowance, 18)),
                parseFloat(formatUnits(balance, 18))
            ),
        },
        mode: 'onChange',
    });

    const validate = (value: number) => {
        const bn = parseUnits(value.toString(), 18);
        if (bn.isZero()) {
            return 'Value must be greater than 0';
        } else if (bn.gt(allowance)) {
            return 'Value must be lower than allowance';
        } else if (bn.gt(balance)) {
            return 'Not enough balance';
        }
        return true;
    };

    return (
        <Stack direction={['column', 'row']} justify="space-between">
            <Title
                title="Deposit"
                icon={<MdAdd />}
                help="Amount of tokens to transfer to pool"
            />
            <HStack align="baseline">
                <FormControl isInvalid={!!errors.deposit}>
                    <Input
                        fontSize="3xl"
                        textAlign="right"
                        type="number"
                        min={0}
                        autoFocus
                        isInvalid={!!errors.deposit}
                        {...register('deposit', {
                            required: true,
                            valueAsNumber: true,
                            validate,
                        })}
                    />
                    <FormErrorMessage>
                        {errors.deposit?.message}
                    </FormErrorMessage>
                </FormControl>
                <Text fontSize="small">CTSI</Text>
                <HStack minW={{ sm: 100 }}>
                    <Tooltip label="Save" placement="top">
                        <IconButton
                            icon={<CheckIcon />}
                            aria-label="Save"
                            size="md"
                            onClick={handleSubmit((data) =>
                                onSubmit(
                                    parseUnits(data.deposit.toString(), 18)
                                )
                            )}
                        />
                    </Tooltip>
                    <Tooltip label="Cancel" placement="top">
                        <IconButton
                            icon={<CloseIcon />}
                            aria-label="Cancel"
                            size="md"
                            onClick={onCancel}
                        />
                    </Tooltip>
                </HStack>
            </HStack>
        </Stack>
    );
};

export default Deposit;
