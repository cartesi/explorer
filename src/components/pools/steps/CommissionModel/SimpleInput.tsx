// Copyright (C) 2022 Cartesi Pte. Ltd.
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { Box, Field, Input, InputGroup } from '@chakra-ui/react';
import { ChangeEvent, ReactNode } from 'react';

// TODO: Refactor and move that to a better place to be reused by more specialised Inputs (e.g. NodeInput, InitialFundsInput)

export interface SimpleInputProps {
    label: string;
    id: string;
    isDisabled?: boolean;
    isInvalid?: boolean;
    inputRightElement?: ReactNode;
    onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (evt: ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (evt: ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
    type?: string;
    reference?: any;
    name?: string;
}

export const SimpleInput = ({
    onChange,
    onBlur,
    onFocus,
    label,
    id,
    inputRightElement,
    isDisabled,
    isInvalid,
    errorMessage,
    type,
    reference,
    name,
}: SimpleInputProps) => {
    return (
        <Field.Root
            pr={{ base: 0, md: '20vw' }}
            invalid={isInvalid}
            disabled={isDisabled}
        >
            <Field.Label htmlFor={id} fontWeight="medium">
                {label}
            </Field.Label>
            <InputGroup
                endElement={
                    <Box m={1} mr={2} color="gray" fontSize={12}>
                        {inputRightElement}
                    </Box>
                }
            >
                <Input
                    name={name}
                    type={type || 'text'}
                    ref={reference}
                    id={id}
                    size="lg"
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                />
            </InputGroup>
            <Field.ErrorText>{errorMessage}</Field.ErrorText>
        </Field.Root>
    );
};
