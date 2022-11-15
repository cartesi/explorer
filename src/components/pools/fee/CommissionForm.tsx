// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC, useEffect, useMemo } from 'react';
import {
    Alert,
    Button,
    Collapse,
    FormControl,
    FormLabel,
    HStack,
    Text,
    VStack,
    Input,
    InputGroup,
    Tooltip,
    Icon,
    InputRightElement,
    Box,
    FormErrorMessage,
    Stack,
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
    progress: number;
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
        progress,
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
        getValues,
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
            <VStack align="stretch">
                <HStack justify="space-between">
                    <FormLabel>
                        Pool commission{' '}
                        <Tooltip
                            placement="bottom"
                            label={helperText}
                            fontSize="small"
                            bg="black"
                            color="white"
                        >
                            <Icon
                                pb={1}
                                width={4}
                                height={4}
                                color="gray.600"
                                role="commission-icon"
                            />
                        </Tooltip>
                    </FormLabel>
                </HStack>

                <Stack direction={['column', 'row']} mt="0 !important">
                    <InputGroup me={6}>
                        <Input
                            size="lg"
                            {...register('value', {
                                valueAsNumber: true,
                                validate,
                            })}
                        />
                        <InputRightElement
                            color="gray.300"
                            pointerEvents="none"
                            w={14}
                            h="100%"
                        >
                            <Box>ETH</Box>
                        </InputRightElement>
                    </InputGroup>

                    <Button
                        colorScheme="blue"
                        w={{ base: '100%', md: 'auto' }}
                        minW="10.8125rem"
                        height="2.875rem"
                        textTransform="uppercase"
                        isDisabled={
                            Number.isNaN(getValues('value')) ||
                            getValues('value') === currentValue ||
                            !!errors.value ||
                            progress >= 1
                        }
                        onClick={handleSubmit((data) => onSubmit(data.value))}
                    >
                        Update
                    </Button>
                </Stack>

                {!!errors.value && (
                    <FormErrorMessage>{errors.value?.message}</FormErrorMessage>
                )}

                <Collapse in={value > currentValue}>
                    <Alert status="warning" variant="left-accent">
                        <Text>
                            After increasing the current value you can only
                            increase it again after {wait}
                        </Text>
                    </Alert>
                </Collapse>
            </VStack>
        </FormControl>
    );
};

export default CommissionForm;
