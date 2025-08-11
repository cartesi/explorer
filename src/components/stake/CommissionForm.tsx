// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { TbAlertTriangleFilled, TbHelp } from 'react-icons/tb';
import {
    Box,
    Button,
    Collapsible,
    Field,
    HStack,
    Icon,
    Input,
    InputGroup,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import humanizeDuration from 'humanize-duration';
import React, { FC, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Tooltip } from '../Tooltip';

export interface CommissionFormProps {
    currentValue: number;
    unit: '%';
    min?: number;
    max?: number;
    maxRaise: number;
    maxDigits: number;
    progress: number;
    nextIncrease?: Date;
    increaseWaitPeriod: number;
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

    const value = watch('value');
    const wait = humanizeDuration(increaseWaitPeriod * 1000);
    const validate = (value: number) => {
        if (Number.isNaN(value)) {
            return 'Value is required';
        } else if (value < min) {
            return `Minimum value is ${min}`;
        } else if (max && value > max) {
            return `Maximum value is ${max}`;
        } else if (
            Math.floor(value * Math.pow(10, maxDigits)) !=
            value * Math.pow(10, maxDigits)
        ) {
            return 'Maximum precision is limited to 2 decimal digits';
        } else if (value > currentValue) {
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

    useEffect(() => {
        reset({ value: currentValue });
    }, [currentValue]);

    return (
        <Field.Root id="commission" invalid={!!errors.value}>
            <VStack align="stretch" width="full">
                <HStack justify="space-between">
                    <Field.Label>
                        Pool commission{' '}
                        <Tooltip
                            showArrow
                            content={helperText}
                            positioning={{
                                placement: 'bottom',
                            }}
                            openDelay={0}
                            contentProps={{
                                fontSize: 'small',
                            }}
                        >
                            <Icon
                                as={TbHelp}
                                width={5}
                                height={5}
                                color="gray.600"
                                role="commission-icon"
                            />
                        </Tooltip>
                    </Field.Label>
                </HStack>

                <Stack direction={['column', 'row']} mt="0 !important">
                    <InputGroup
                        me={6}
                        endElement={
                            <Box
                                color="gray.300"
                                pointerEvents="none"
                                fontSize="md"
                            >
                                {unit.toUpperCase()}
                            </Box>
                        }
                    >
                        <Input
                            size="lg"
                            {...register('value', {
                                valueAsNumber: true,
                                validate,
                            })}
                        />
                    </InputGroup>

                    <Button
                        colorPalette="gray"
                        variant="ghost"
                        w={{ base: '100%', md: 'auto' }}
                        minW="10.8125rem"
                        height="2.875rem"
                        textTransform="uppercase"
                        disabled={
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
                    <Field.ErrorText>{errors.value?.message}</Field.ErrorText>
                )}

                <Collapsible.Root open={value > currentValue}>
                    <Collapsible.Content>
                        <HStack gap={2} alignItems="flex-start">
                            <Icon
                                as={TbAlertTriangleFilled}
                                color="orange.500"
                            />
                            <Text fontSize="sm">
                                After increasing the current value you can only
                                increase it again after {wait}
                            </Text>
                        </HStack>
                    </Collapsible.Content>
                </Collapsible.Root>
            </VStack>
        </Field.Root>
    );
};

export default CommissionForm;
