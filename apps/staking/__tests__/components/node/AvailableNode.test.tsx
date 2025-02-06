// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { fireEvent, render, screen } from '@testing-library/react';
import { BigNumber } from 'ethers';
import { FieldValues, FormState, useForm } from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form/dist/types';
import AvailableNode from '../../../src/components/node/AvailableNode';
import { withChakraTheme } from '../../test-utilities';

jest.mock('react-hook-form', () => {
    const originalModule = jest.requireActual('react-hook-form');
    return {
        __esModule: true,
        ...originalModule,
        useForm: jest.fn(),
    };
});

const mockedUseForm = useForm as jest.MockedFunction<typeof useForm>;

const Component = withChakraTheme(AvailableNode);

const props = {
    balance: BigNumber.from('100000'),
    onHire: jest.fn(),
};

const useFormData = {
    register: jest.fn(),
    handleSubmit: jest.fn(),
    formState: {
        errors: {
            deposit: undefined,
        },
    } as unknown as FormState<FieldValues>,
} as unknown as UseFormReturn<any>;

describe('AvailableNode component', () => {
    it('should trigger submit when button is clicked', () => {
        const mockedHandleSubmit = jest.fn();
        mockedUseForm.mockReturnValue({
            ...useFormData,
            handleSubmit: mockedHandleSubmit,
        });

        const { container } = render(<Component {...props} />);

        const button = container.querySelector('button');
        fireEvent.click(button);

        expect(mockedHandleSubmit).toHaveBeenCalled();
    });

    it('should display error message', () => {
        const errorMessage = 'Some error';
        mockedUseForm.mockReturnValue({
            ...useFormData,
            formState: {
                errors: {
                    deposit: {
                        message: errorMessage,
                    },
                },
            } as unknown as FormState<FieldValues>,
        });

        render(<Component {...props} />);
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should display helper text when there is no error', () => {
        mockedUseForm.mockReturnValue(useFormData);

        render(<Component {...props} />);
        expect(
            screen.getByText('Amount of ETH to transfer to node on hire')
        ).toBeInTheDocument();
    });
});
