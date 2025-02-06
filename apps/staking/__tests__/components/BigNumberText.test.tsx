// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import BigNumberText from '../../src/components/BigNumberText';
import { withChakraTheme } from '../test-utilities';

const defaultProps = {
    value: 10,
};

const Component = withChakraTheme(BigNumberText);

describe('BigNumberText component', () => {
    const renderComponent = (props = {}) =>
        render(<Component {...defaultProps} {...props} />);

    it('should show unit label when value is larger than zero and unit has label', () => {
        renderComponent({
            value: 1000,
            unit: 'ctsi',
        });

        expect(
            screen.getByTestId('big-number-text-unit-label')
        ).toBeInTheDocument();
    });

    it('should not show unit label when value is zero and unit has no label', () => {
        renderComponent({
            value: 0,
            unit: 'number',
        });

        expect(() => screen.getByTestId('big-number-text-unit-label')).toThrow(
            'Unable to find an element by: [data-testid="big-number-text-unit-label"]'
        );
    });

    it('should display countdown when related props are provided', () => {
        const timeLeft = 1000;
        const timeLabel = 'Countdown';
        renderComponent({
            countdown: {
                timeLeft,
                timeLabel,
            },
        });

        expect(
            screen.getByText(`${timeLabel} ${timeLeft}`)
        ).toBeInTheDocument();
    });

    it('should not display countdown when related props are missing', () => {
        const timeLeft = 1000;
        const timeLabel = 'Countdown';
        renderComponent();

        expect(() => screen.getByText(`${timeLabel} ${timeLeft}`)).toThrow(
            'Unable to find an element'
        );
    });
});
