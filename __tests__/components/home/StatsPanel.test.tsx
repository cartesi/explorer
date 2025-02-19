// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import StatsPanel from '../../../src/components/home/StatsPanel';
import { withChakraTheme } from '../../test-utilities';

const Component = withChakraTheme(StatsPanel);

describe('StatsPanel component', () => {
    it('should append additional props', () => {
        const value = 'attention-icon';
        render(<Component data-testid={value}>Content</Component>);

        expect(screen.getByTestId(value)).toBeInTheDocument();
    });
});
