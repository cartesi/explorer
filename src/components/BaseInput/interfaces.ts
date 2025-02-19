// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

type ErrorContent = { message: string; type: string };

export interface ValidationResult<TName = string> {
    name: TName;
    error?: ErrorContent;
    isValid: boolean;
}
export interface BaseInput<TValidation = string> {
    onChange: (value: string) => void;
    onFocus?: (value: string) => void;
    helperText?: string;
    onValidationChange?: (
        validationResult: ValidationResult<TValidation>
    ) => void;
    isDisabled?: boolean;
}

/**
 * Generated a type where the keys are the values of the defined
 * ValidationResult type e.g. ValidationResult<'deposit' |  'nodeAddress'>
 * Possible keys of the generated type are the union deposit|nodeAddress. When type is not defined
 * the key are any string.
 */
export type MappedErrors<T = ValidationResult> = T extends ValidationResult<
    infer R
>
    ? { [K in Extract<R, string>]: T }
    : { [key: string | undefined]: T };

/**
 * Alias for MappedErrors but the keys of said typed object are optional.
 */
export type OptionalMappedErrors<T> = Partial<MappedErrors<T>>;
