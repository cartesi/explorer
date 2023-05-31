// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, fireEvent } from '@testing-library/react';
import SearchInput from '../../src/components/SearchInput';
import { withChakraTheme } from '../test-utilities';

const Component = withChakraTheme(SearchInput);
const props = {
    placeholder: 'Some placeholder',
    onSearchChange: jest.fn(),
};

describe('SearchInput component', () => {
    it('should display correct placeholder', () => {
        const { container } = render(<Component {...props} />);
        const input = container.querySelector('input');
        expect(input.getAttribute('placeholder')).toBe(props.placeholder);
    });

    it('should invoke onSearchChange callback', () => {
        const mockedOnSearchChange = jest.fn();
        const search = 'Some search';
        const { container } = render(
            <Component {...props} onSearchChange={mockedOnSearchChange} />
        );
        const input = container.querySelector('input');

        fireEvent.change(input, {
            target: {
                value: search,
            },
        });

        expect(mockedOnSearchChange).toHaveBeenCalled();
    });
});
