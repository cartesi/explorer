// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { render, screen } from '@testing-library/react';
import {
    TimerButton,
    TimerButtonProps,
} from '../../../src/components/base/Button';
import { withChakraTheme } from '../../test-utilities';

const Component = withChakraTheme<TimerButtonProps>(TimerButton);

describe('Timer Button', () => {
    // a default configured component
    const renderComponent = (props) => render(<Component {...props} />);

    it('Should display 59 seconds remaining', () => {
        renderComponent({
            children: 'Button',
            remainingTime: Date.now() + 60000,
        });

        const label = screen.getByText('00:00:59');
        expect(label).toBeInTheDocument();
    });

    it('Should display 9 minutes and 59 seconds remaining', () => {
        renderComponent({
            children: 'Button',
            remainingTime: Date.now() + 600000,
        });

        const label = screen.getByText('00:09:59');
        expect(label).toBeInTheDocument();
    });

    it('Should display 1 hour, 39 minutes and 59 seconds remaining', () => {
        renderComponent({
            children: 'Button',
            remainingTime: Date.now() + 6000000,
        });

        const label = screen.getByText('01:39:59');
        expect(label).toBeInTheDocument();
    });
});
