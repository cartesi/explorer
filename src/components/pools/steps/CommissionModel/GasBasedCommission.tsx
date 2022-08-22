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
import { isNil } from 'lodash/fp';
import { Message } from './MessageBlock';

type GasBasedModel = 'gasBasedCommission';
type GasBasedCommissionProps = BaseInput<GasBasedModel>;

type GasBasedFormField = { [k in GasBasedModel]: number };

const GasBasedCommission = ({
    onChange,
    onValidationChange,
    isDisabled,
}: GasBasedCommissionProps) => {
    const howItWorks = useMessages('commission.model.gasBased.howItWorks');
    const validator = useFieldValidator<GasBasedFormField, GasBasedModel>({
        fieldName: 'gasBasedCommission',
        onValidationChange,
    });

    const { trigger, registerReturn, errors, clearErrors, isDirty } = validator;
    const { name, onChange: onChangeValidate, ref } = registerReturn;
    const { gasBasedCommission: inputErrors } = errors;

    useEffect(() => {
        if (isDisabled) {
            clearErrors();
            return;
        }

        if (isDirty) trigger('gasBasedCommission');
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
                    trigger('gasBasedCommission');
                }}
                onBlur={() => {
                    if (!isDisabled) {
                        return trigger('gasBasedCommission');
                    }
                }}
                label="Gas-based commission (Gas)"
                id="gasBasedCommission"
                inputRightElement="ETH"
                isInvalid={!isNil(inputErrors)}
                errorMessage={inputErrors?.message}
            />
            <Message content={howItWorks} />
        </VStack>
    );
};

export type { GasBasedCommissionProps, GasBasedModel };
export default GasBasedCommission;
