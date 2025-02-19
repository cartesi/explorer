import { isEmpty, isFunction } from 'lodash/fp';
import { useEffect } from 'react';
import { Path, RegisterOptions, useForm } from 'react-hook-form';
import { useMessages } from '../../../../utils/messages';
import { ValidationResult } from '../../../BaseInput';

type UseFieldValidatorProps<T, V> = {
    fieldName: Path<T>;
    options?: RegisterOptions<T>;
    onValidationChange?: (vr: ValidationResult<V>) => void;
};

const useFieldValidator = <FormValidatorType, ValidationResultType>({
    fieldName,
    options,
    onValidationChange,
}: UseFieldValidatorProps<FormValidatorType, ValidationResultType>) => {
    const {
        register,
        formState: { errors, isDirty },
        getValues,
        trigger,
        reset,
        clearErrors,
    } = useForm<FormValidatorType>();

    const registerReturn = register(fieldName, {
        shouldUnregister: true,
        valueAsNumber: true,
        required: {
            value: true,
            message: useMessages('field.isRequired'),
        },
        ...options,
    } as RegisterOptions);

    const inputErrors = errors[fieldName as string];

    useEffect(() => {
        if (!isFunction(onValidationChange)) return;

        const validation: ValidationResult<ValidationResultType> = {
            name: fieldName as ValidationResultType,
            isValid: isEmpty(inputErrors),
        };
        if (!isEmpty(inputErrors)) {
            const { type, message } = inputErrors;
            validation.error = { message, type };
        }

        onValidationChange(validation);
    }, [inputErrors]);

    return {
        registerReturn,
        trigger,
        errors,
        reset,
        clearErrors,
        isDirty,
        getValue: () => getValues(fieldName),
    };
};

export type { UseFieldValidatorProps };
export default useFieldValidator;
