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
    Alert,
    AlertIcon,
    Box,
    BoxProps,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputRightAddon,
    Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { BigNumber, BigNumberish } from 'ethers';
import { formatCTSI } from '../../utils/token';
import theme from '../../styles/theme';
import { parseUnits } from 'ethers/lib/utils';

interface UnstakeFormProps extends BoxProps {
    maturing: BigNumber;
    staked: BigNumber;
    disabled?: boolean;
    onUnstake: (amount: BigNumberish) => void;
}

const UnstakeForm: FC<UnstakeFormProps> = (props) => {
    const {
        maturing,
        staked,
        disabled = false,
        onUnstake,
        ...restProps
    } = props;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<{ amount: number }>({
        defaultValues: {
            amount: 0,
        },
    });

    const amount = watch('amount') || 0;

    // convert to CTSI
    const amount_ = parseUnits(amount.toString(), 18);

    // use everything that is currently maturing
    const fromMaturing = maturing.gt(amount_) ? amount_ : maturing;

    // everything else must come from staked
    const fromStaked = amount_.sub(fromMaturing);

    const validate = (value: number) => {
        if (value <= 0) {
            return 'Value must be greater than 0';
        }
        return true;
    };

    const doUnstake = (amount: number) => {
        onUnstake(parseUnits(amount.toString(), 18));
        reset({ amount: 0 });
    };

    return (
        <Box {...restProps}>
            <FormControl isInvalid={!!errors.amount}>
                <FormLabel>Amount to unstake</FormLabel>

                <InputGroup>
                    <Input
                        type="number"
                        min={0}
                        isInvalid={!!errors.amount}
                        isDisabled={disabled}
                        {...register('amount', {
                            required: true,
                            valueAsNumber: true,
                            validate,
                        })}
                    />
                    <InputRightAddon children="CTSI" />
                </InputGroup>
                <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>

            <Box>
                {fromMaturing.gt(0) && (
                    <Alert status="info" mt={2}>
                        <AlertIcon />

                        <Flex justify="space-between" width="100%">
                            <Text>
                                {formatCTSI(fromMaturing)}{' '}
                                <Text display="inline" fontSize="sm">
                                    CTSI
                                </Text>
                            </Text>

                            <Text>From "maturing"</Text>
                        </Flex>
                    </Alert>
                )}

                {fromStaked.gt(0) && (
                    <Alert status="info" mt={2}>
                        <AlertIcon />

                        <Flex justify="space-between" width="100%">
                            <Text>
                                {formatCTSI(fromStaked)}{' '}
                                <Text display="inline" fontSize="sm">
                                    CTSI
                                </Text>
                            </Text>

                            <Text>From "staked"</Text>
                        </Flex>
                    </Alert>
                )}
                {fromStaked.gt(staked) && (
                    <Alert status="warning" mt={2}>
                        <AlertIcon />
                        <Text>Maximum unstaking limit exceeded!</Text>
                    </Alert>
                )}
            </Box>

            <Button
                size="sm"
                mt={2}
                py={4}
                height="auto"
                borderRadius={2}
                color="white"
                bg={disabled ? theme.colors.gray9 : theme.colors.secondary}
                _hover={{
                    filter: 'opacity(90%)',
                }}
                isFullWidth
                isDisabled={disabled}
                onClick={handleSubmit((data) => doUnstake(data.amount))}
            >
                Unstake
            </Button>

            <Text fontSize="12px" color="red.500" align="center" mt={4}>
                The releasing status will restart counting.
            </Text>
        </Box>
    );
};

export default UnstakeForm;
