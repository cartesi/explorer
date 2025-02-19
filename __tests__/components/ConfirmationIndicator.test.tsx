// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import ConfirmationIndicator from '../../src/components/ConfirmationIndicator';
import { withChakraTheme } from '../test-utilities';

const Component = withChakraTheme(ConfirmationIndicator);

describe('ConfirmationIndicator component', () => {
    it('should display correct label while loading', () => {
        render(<Component loading />);
        expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should display correct label when not loading', () => {
        render(<Component loading={false} />);
        expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('should display correct label when error has occurred', () => {
        render(<Component loading={false} error="error" />);
        expect(screen.getByText('Failure')).toBeInTheDocument();
    });
});
