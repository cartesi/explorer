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

export interface CommissionFormProps {
    currentValue: number; // current value
    unit: string; // unit: '%' | 'gas'
    min?: number; // minimum value
    max?: number; // maximum value
    maxRaise: number; // max raise of the value
    maxDigits: number; // max number of decimals digits
    nextIncrease?: Date; // when the next increase can happen
    increaseWaitPeriod: number; // seconds
    helperText?: string;
    onSubmit: (value: number) => void;
}

interface FormData {
    value: number;
}

const CommissionForm: FC<CommissionFormProps> = (props) => {
    const {
        currentValue,
        unit,
        min = 0,
        max,
        maxRaise,
        maxDigits = 2,
        increaseWaitPeriod,
        nextIncrease,
        helperText,
        onSubmit,
    } = props;
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<FormData>({
        defaultValues: useMemo(() => ({ value: currentValue }), [currentValue]),
        mode: 'onChange',
    });

    // reset to default values if current value changes
    useEffect(() => reset({ value: currentValue }), [currentValue]);

    const value = watch('value');
    const wait = humanizeDuration(increaseWaitPeriod * 1000);
    const validate = (value: number) => {
        if (Number.isNaN(value)) {
            return 'Value is required';
        } else if (value < min) {
            // not allow lower than 0
            return `Minimum value is ${min}`;
        } else if (max && value > max) {
            // not allow more then max
            return `Maximum value is ${max}`;
        } else if (
            Math.floor(value * Math.pow(10, maxDigits)) !=
            value * Math.pow(10, maxDigits)
        ) {
            // in the smart contract value is an integer with base 10000
            // so we only support two decimals points
            return 'Maximum precision is limited to 2 decimal digits';
        } else if (value > currentValue) {
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
            if (value - currentValue > maxRaise) {
                return `Value can only be increased by at most ${maxRaise} ${unit}`;
            }
        }
    };

    return (
        <FormControl id="commission" isInvalid={!!errors.value}>
            <FormLabel>Commission</FormLabel>
            <Collapse in={value > currentValue}>
                <Alert status="warning" variant="left-accent">
                    <Text>
                        After increasing the current value you can only increase
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
                <InputGroup w={200}>
                    <Input
                        {...register('value', {
                            valueAsNumber: true,
                            validate,
                        })}
                    />
                    <InputRightAddon children={unit} />
                </InputGroup>
                <Button
                    onClick={handleSubmit((data) => onSubmit(data.value))}
                    size="md"
                >
                    Save
                </Button>
            </HStack>
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    );
};

export default CommissionForm;
