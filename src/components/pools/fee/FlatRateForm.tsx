// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import {
    Alert,
    Button,
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
    nextIncrease: Date; // when the next increase can happen
    increaseWaitPeriod: number; // seconds
    onSubmit: (rate: number) => void;
}

interface FormData {
    value: number;
}

const FlatRateForm: FC<FlatRateFormProps> = (props) => {
    const { rate, increaseWaitPeriod, onSubmit } = props;
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormData>({
        defaultValues: { value: rate },
    });

    const value = watch('value');
    const wait = humanizeDuration(increaseWaitPeriod * 1000);

    return (
        <FormControl id="commission" isInvalid={!!errors.value}>
            <FormLabel>Commission</FormLabel>
            {value > rate && (
                <Alert status="warning" variant="left-accent">
                    <Text>
                        After increasing the current rate you can only increase
                        it again after {wait}
                    </Text>
                </Alert>
            )}
            <HStack>
                <InputGroup>
                    <Input
                        w={100}
                        {...register('value', {
                            min: 0,
                            max: 100,
                            valueAsNumber: true,
                            required: true,
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
