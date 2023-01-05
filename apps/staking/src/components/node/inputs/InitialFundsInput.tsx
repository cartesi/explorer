// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    useColorModeValue,
} from '@chakra-ui/react';
import { isEmpty, isFunction, isNil } from 'lodash/fp';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useWallet } from '@explorer/wallet';
import { useBalance } from '../../../services/eth';
import { useMessages } from '../../../utils/messages';
import { formatValue } from '../../../utils/numberFormatter';
import { toBigNumber } from '../../../utils/numberParser';
import { BaseInput, ValidationResult } from '../../BaseInput';

type DepositField = 'deposit';

interface InitialFundsInputProps extends BaseInput<DepositField> {
    min: number;
    max: number;
    styleProps?: Record<string, unknown>;
}

const numberFormatOpts: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
};

const InitialFundsInput = ({
    onChange,
    min,
    max,
    onValidationChange,
    styleProps,
}: InitialFundsInputProps) => {
    const helperTxtColor = useColorModeValue('gray', 'gray.100');
    const { account, active } = useWallet();
    const balance = useBalance(account);
    const userBalance = active ? balance : toBigNumber(0);
    const ethBalance =
        userBalance && active
            ? formatValue(userBalance, 'eth', numberFormatOpts)
            : '0.00';
    const {
        register,
        formState: { errors, isDirty },
        trigger,
    } = useForm<{ deposit: number }>();

    const validate = (value: number) => {
        if (toBigNumber(value.toString()).gt(userBalance)) {
            return 'Insufficient ETH balance';
        }
        return true;
    };

    const {
        name,
        onChange: onChangeValidate,
        ref,
    } = register('deposit', {
        shouldUnregister: true,
        valueAsNumber: true,
        validate,
        required: {
            value: true,
            message: useMessages('field.isRequired'),
        },
        max: {
            value: max,
            message: useMessages('deposit.maxAllowed', max),
        },
        min: {
            value: min,
            message: useMessages('deposit.minAllowed', min),
        },
    });

    const { deposit: depositErrors } = errors;

    useEffect(() => {
        if (isDirty) trigger('deposit');
    }, [active]);

    useEffect(() => {
        if (!isFunction(onValidationChange)) return;

        const validation: ValidationResult<DepositField> = {
            name: 'deposit',
            isValid: isEmpty(depositErrors),
        };
        if (!isEmpty(depositErrors)) {
            const { type, message } = depositErrors;
            validation.error = { message, type };
        }

        onValidationChange(validation);
    }, [depositErrors]);

    return (
        <FormControl
            pr={{ base: 0, md: '20vw' }}
            isInvalid={!isNil(depositErrors)}
            {...styleProps}
        >
            <FormLabel htmlFor="initial_funds" fontWeight="medium">
                Initial Funds
            </FormLabel>
            <InputGroup>
                <Input
                    size="lg"
                    ref={ref}
                    id="initial_funds"
                    name={name}
                    type="number"
                    onBlur={() => trigger('deposit')}
                    onChange={(evt) => {
                        onChangeValidate(evt);
                        onChange(evt?.target?.value);
                        //trigger validations for registered field called deposit
                        trigger('deposit');
                    }}
                />
                <InputRightElement
                    children="ETH"
                    m={1}
                    mr={2}
                    color="gray"
                    fontSize={12}
                />
            </InputGroup>
            <FormErrorMessage>{depositErrors?.message}</FormErrorMessage>
            <FormHelperText color={helperTxtColor} fontSize={14}>
                Your balance: {ethBalance} ETH
            </FormHelperText>
        </FormControl>
    );
};

export type { DepositField };
export { InitialFundsInput };
