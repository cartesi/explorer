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
import StakeCard, {
    StakeCardProps,
} from '../../../src/components/stake/StakeCard';
import { withChakraTheme } from '../../test-utilities';

const defaultProps = {
    Icon: <span>Icon</span>,
    Title: <span>Title</span>,
    children: <span>Children</span>,
};

const Component = withChakraTheme<StakeCardProps>(StakeCard);

describe('Pool Performance Table', () => {
    const renderComponent = (props) =>
        render(<Component {...props}>{props.children}</Component>);

    it('Should have icon node', () => {
        renderComponent(defaultProps);

        expect(screen.getByText('Icon')).toBeInTheDocument();
    });

    it('Should spread additional props in component node', () => {
        const props = {
            ...defaultProps,
            className: 'stake-card',
            style: {
                fontWeight: 900,
            },
        };
        renderComponent(props);

        const componentNode = screen.getByText('Icon').closest('.stake-card');
        expect(componentNode.getAttribute('style')).toBe(
            `font-weight: ${props.style.fontWeight};`
        );
    });
});
