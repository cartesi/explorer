// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import Banner from '@explorer/ui/src/components/Banner';
import { render, screen } from '@testing-library/react';
import { withChakraTheme } from '../../test-utilities';

const defaultProps = {
    Icon: <span>Icon</span>,
    Title: <span>Title</span>,
    children: <span>Children</span>,
};

const Component = withChakraTheme(Banner);

describe('Banner', () => {
    const renderComponent = (props) =>
        render(<Component {...props}>{props.children}</Component>);

    it('Should have icon node', () => {
        renderComponent(defaultProps);

        expect(screen.getByText('Icon')).toBeInTheDocument();
    });

    it('Should spread additional props in component node', () => {
        const className = 'stake-card';
        const props = {
            ...defaultProps,
            className,
            style: {
                fontWeight: 900,
            },
        };
        renderComponent(props);

        const componentNode = screen.getByText('Icon').closest(`.${className}`);
        expect(componentNode.getAttribute('style')).toBe(
            `font-weight: ${props.style.fontWeight};`
        );
    });
});
