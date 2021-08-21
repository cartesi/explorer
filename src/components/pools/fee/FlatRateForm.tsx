// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC, useEffect, useMemo } from 'react';
import {
    Alert,
    Button,
    Collapse,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputRightAddon,
    Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import humanizeDuration from 'humanize-duration';

export interface FlatRateFormProps {
    rate: number; // current rate
    maxRaise: number; // max raise of the value
    nextIncrease?: Date; // when the next increase can happen
    increaseWaitPeriod: number; // seconds
    onSubmit: (rate: number) => void;
}

interface FormData {
    value: number;
}

const FlatRateForm: FC<FlatRateFormProps> = (props) => {
    const { rate, maxRaise, increaseWaitPeriod, nextIncrease, onSubmit } =
        props;
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<FormData>({
        defaultValues: useMemo(() => ({ value: rate }), [rate]),
        mode: 'onChange',
    });

    // reset to default values if rate changes
    useEffect(() => reset({ value: rate }), [rate]);

    const value = watch('value');
    const wait = humanizeDuration(increaseWaitPeriod * 1000);
    const validate = (value: number) => {
        if (Number.isNaN(value)) {
            return 'Value is required';
        } else if (value < 0) {
            // not allow lower than 0
            return 'Minimum value is zero';
        } else if (value > 100) {
            // not allow more then 100%
            return 'Maximum value is 100';
        } else if (Math.floor(value * 100) != value * 100) {
            // in the smart contract value is an integer with base 10000
            // so we only support two decimals points
            return 'Maximum precision is limited to 2 decimal digits';
        } else if (value > rate) {
            // check increase time restriction
            if (nextIncrease) {
                const timeout = nextIncrease.getTime() - Date.now();
                if (timeout > 0) {
                    return `Value can only be increased in ${humanizeDuration(
                        timeout,
                        { round: true, largest: 2 }
                    )}`;
                }
            }
            if (value - rate > maxRaise) {
                return `Value can only be increased by at most ${maxRaise}%`;
            }
        }
    };

    return (
        <FormControl id="commission" isInvalid={!!errors.value}>
            <FormLabel>Commission</FormLabel>
            <Collapse in={value > rate}>
                <Alert status="warning" variant="left-accent">
                    <Text>
                        After increasing the current rate you can only increase
                        it again after {wait}
                    </Text>
                </Alert>
            </Collapse>
            <Collapse in={!!errors.value}>
                <Alert status="error" variant="left-accent">
                    <Text>{errors.value?.message}</Text>
                </Alert>
            </Collapse>
            <HStack>
                <InputGroup>
                    <Input
                        w={100}
                        {...register('value', {
                            valueAsNumber: true,
                            validate,
                        })}
                    />
                    <InputRightAddon children="%" />
                </InputGroup>
                <Button onClick={handleSubmit((data) => onSubmit(data.value))}>
                    Save
                </Button>
            </HStack>
            <FormHelperText>
                Commission is set as a fixed percentage of every block reward
                (CTSI)
            </FormHelperText>
        </FormControl>
    );
};

export default FlatRateForm;
