// Copyright (C) 2022 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { VStack } from '@chakra-ui/react';
import { SimpleInput } from './SimpleInput';
import { useEffect } from 'react';
import { useMessages } from '../../../../utils/messages';
import { BaseInput } from '../../../BaseInput';
import useFieldValidator from './useFieldValidator';
import { isNil, last } from 'lodash/fp';
import { Message } from './MessageBlock';

type FlatRateModel = 'flatRateCommission';
type FlatRateCommisionProps = BaseInput<FlatRateModel>;

const maxDecimalPlaces = (maxDecimalPlaces: number) => (value: number) => {
    if (Math.floor(value?.valueOf()) === value?.valueOf()) return true;

    const currentDecimalPlaces = last(value.toString().split('.'))?.length;
    if (currentDecimalPlaces <= maxDecimalPlaces) return true;

    return useMessages('field.value.max.allowed', 2, 'decimal places');
};

// validation options
const options = {
    max: {
        value: 100,
        message: useMessages('field.value.max.allowed', 100),
    },
    min: {
        value: 0,
        message: useMessages('field.value.min.allowed', 0),
    },
    validate: maxDecimalPlaces(2),
};

const FlatRateCommission = ({
    onChange,
    onValidationChange,
    isDisabled,
}: FlatRateCommisionProps) => {
    type FormField = { [k in FlatRateModel]: number };
    const howItWorks = useMessages('commission.model.flatRate.howItWorks');
    const validator = useFieldValidator<FormField, FlatRateModel>({
        fieldName: 'flatRateCommission',
        options,
        onValidationChange,
    });
    const { trigger, registerReturn, errors, clearErrors, isDirty } = validator;
    const { name, onChange: onChangeValidate, ref } = registerReturn;

    useEffect(() => {
        if (isDisabled) {
            clearErrors();
            return;
        }

        if (isDirty) trigger('flatRateCommission');
    }, [isDisabled]);

    return (
        <VStack spacing={3}>
            <SimpleInput
                name={name}
                type="number"
                reference={ref}
                onChange={(e) => {
                    onChange(e.currentTarget?.value);
                    onChangeValidate(e);
                    trigger('flatRateCommission');
                }}
                onBlur={(e) => trigger('flatRateCommission')}
                label="Flat-rate commission (%)"
                id="flatRateCommission"
                inputRightElement="%"
                isDisabled={isDisabled}
                isInvalid={!isNil(errors.flatRateCommission)}
                errorMessage={errors.flatRateCommission?.message}
            />
            <Message content={howItWorks} />
        </VStack>
    );
};

export type { FlatRateCommisionProps, FlatRateModel };
export default FlatRateCommission;
