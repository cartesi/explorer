// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    ICTSINumberInputProps,
    CTSINumberInput,
} from '../../../src/components/stake/CTSINumberInput';
import { withChakraTheme } from '../../test-utilities';
import userEvent from '@testing-library/user-event';

const defaultProps = {
    value: undefined,
};

const ECTSINumberInput =
    withChakraTheme<ICTSINumberInputProps>(CTSINumberInput);

describe('CTSI Number Input', () => {
    // a default configured component
    const renderComponent = () =>
        render(<ECTSINumberInput {...defaultProps} />);

    it('Should display CTSI label', () => {
        renderComponent();
        expect(screen.getByText('CTSI')).toBeInTheDocument();
    });

    it('Should display input field', () => {
        const { container } = renderComponent();
        expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('Should have correct initial value', async () => {
        const initialValue = 150;
        const { container } = render(
            <ECTSINumberInput {...defaultProps} value={initialValue} />
        );

        const input = container.querySelector('input');

        await waitFor(() => expect(input).toHaveValue(initialValue.toString()));
    });

    it('Should disallow forbidden symbols', async () => {
        renderComponent();

        const input = screen.getByRole('spinbutton');

        await userEvent.type(input, '-');
        fireEvent.blur(input);
        await waitFor(() => expect(input).toHaveValue('0'));

        fireEvent.focus(input);
        await userEvent.type(input, '+');
        fireEvent.blur(input);
        await waitFor(() => expect(input).toHaveValue('0'));

        fireEvent.focus(input);
        await userEvent.type(input, 'e');
        fireEvent.blur(input);
        await waitFor(() => expect(input).toHaveValue('0'));

        fireEvent.focus(input);
        await userEvent.type(input, '..');
        fireEvent.blur(input);
        await waitFor(() => expect(input).toHaveValue('0'));
    });

    it('Should set new value', () => {
        const { container } = renderComponent();
        const value = 150;
        const input = container.querySelector('input');

        fireEvent.change(input, {
            target: {
                value: value.toString(),
            },
        });

        expect(input).toHaveValue(value.toString());
    });
});
