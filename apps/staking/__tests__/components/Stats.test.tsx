// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import Stats from '../../src/components/Stats';
import { withChakraTheme } from '../test-utilities';

const Component = withChakraTheme(Stats);
const props = {
    label: 'Some label',
};

describe('Stats component', () => {
    it('should display label', () => {
        render(<Component {...props} />);
        expect(screen.getByText(props.label)).toBeInTheDocument();
    });

    it('should display value label', () => {
        const unit = 'percent';
        const value = 50;
        const numberFormat = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
            notation: 'compact',
            style: unit,
        });

        render(<Component {...props} value={value} unit={unit} />);
        expect(
            screen.getByText(numberFormat.format(value))
        ).toBeInTheDocument();
    });

    it('should display tooltip', async () => {
        const help = 'Number of users who staked in this pool';
        render(<Component {...props} help={help} />);

        const icon = screen.getByTestId('stats-tooltip-icon');
        await act(() => {
            userEvent.hover(icon);
        });

        await screen.findByText(help);
        expect(screen.getByText(help)).toBeInTheDocument();
    });
});
