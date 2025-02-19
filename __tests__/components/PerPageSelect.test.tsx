// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import PerPageSelect from '../../src/components/PerPageSelect';
import { withChakraTheme } from '../test-utilities';

const Component = withChakraTheme(PerPageSelect);

const defaultProps = {
    value: 10,
    options: [10, 20, 30],
    onChange: () => undefined,
};

describe('PerPageSelect component', () => {
    it('should display required label', () => {
        render(<Component {...defaultProps} />);
        expect(screen.getByText('Rows per page')).toBeInTheDocument();
    });

    it('should display correct per page options', () => {
        render(<Component {...defaultProps} />);

        defaultProps.options.map((option) => {
            expect(screen.getByText(option)).toBeInTheDocument();
        });
    });
});
