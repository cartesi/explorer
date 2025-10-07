import { isEmpty, isFunction } from 'lodash/fp';
import { useEffect } from 'react';
import {
    FieldErrors,
    Path,
    RegisterOptions,
    useForm,
    UseFormClearErrors,
    UseFormGetValues,
    UseFormRegisterReturn,
    UseFormReset,
    UseFormTrigger,
} from 'react-hook-form';
import { useMessages } from '../../../../utils/messages';
import { ValidationResult } from '../../../BaseInput';

type UseFieldValidatorProps<T, V> = {
    fieldName: Path<T>;
    options?: RegisterOptions<T>;
    onValidationChange?: (vr: ValidationResult<V>) => void;
};

/**
 * Explicit type annotation to avoid TS7056 error due to
 * compiler limits to infer the types on complex types.
 * (ref: https://github.com/microsoft/TypeScript/issues/43817)
 */
type UseFieldValidator<FormValidatorType> = {
    registerReturn: UseFormRegisterReturn<Path<FormValidatorType>>;
    trigger: UseFormTrigger<FormValidatorType>;
    errors: FieldErrors<FormValidatorType>;
    reset: UseFormReset<FormValidatorType>;
    clearErrors: UseFormClearErrors<FormValidatorType>;
    isDirty: boolean;
    getValue: () => ReturnType<UseFormGetValues<FormValidatorType>>[0];
};

const useFieldValidator = <FormValidatorType, ValidationResultType>({
    fieldName,
    options,
    onValidationChange,
}: UseFieldValidatorProps<
    FormValidatorType,
    ValidationResultType
>): UseFieldValidator<FormValidatorType> => {
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
    } as RegisterOptions<FormValidatorType>);

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
