// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import IconLink from '../../src/components/IconLink';
import { withChakraTheme } from '../test-utilities';

const Component = withChakraTheme(IconLink);
const props = {
    href: 'https://google.com',
    tooltip: 'Google',
    icon: 'Link to Google',
};

describe('IconLink component', () => {
    it('should display correct link', () => {
        const { container } = render(<Component {...props} />);
        const link = container.querySelector('a');

        expect(link.getAttribute('href')).toBe(props.href);
    });

    it('should display link icon', () => {
        render(<Component {...props} />);
        expect(screen.getByText(props.icon)).toBeInTheDocument();
    });
});
