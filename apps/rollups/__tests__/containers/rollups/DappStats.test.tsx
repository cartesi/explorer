// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DappStats } from '../../../src/containers/rollups/DappStats';
import { withChakraTheme } from '../../test-utilities';

const Component = withChakraTheme(DappStats);

const defaultProps = {
    inputs: 20,
    notices: 30,
    reports: 40,
    vouchers: 50,
};

describe('DappStats container', () => {
    it('should display inputs tooltip', async () => {
        render(<Component {...defaultProps} />);
        const text = 'Total number of inputs processed';

        const icon = screen.getByTestId('inputs-icon');
        await act(() => {
            userEvent.click(icon);
        });

        await screen.findByText(text);
        expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('should display reports tooltip', async () => {
        render(<Component {...defaultProps} />);
        const text = 'Total number of reports emitted';

        const icon = screen.getByTestId('reports-icon');
        await act(() => {
            userEvent.click(icon);
        });

        await screen.findByText(text);
        expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('should display notices tooltip', async () => {
        render(<Component {...defaultProps} />);
        const text = 'Total number of notices emitted';

        const icon = screen.getByTestId('notices-icon');
        await act(() => {
            userEvent.click(icon);
        });

        await screen.findByText(text);
        expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('should display vouchers tooltip', async () => {
        render(<Component {...defaultProps} />);
        const text = 'Total number of vouchers emitted';

        const icon = screen.getByTestId('vouchers-icon');
        await act(() => {
            userEvent.click(icon);
        });

        await screen.findByText(text);
        expect(screen.getByText(text)).toBeInTheDocument();
    });
});
