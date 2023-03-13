// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { withChakraTheme } from '../test-utilities';
import { DAppsList } from '../../src/components/DAppsList';

const Component = withChakraTheme(DAppsList);

const dapps = Array.from({ length: 3 }).map((_, index) => ({
    id: String(index + 1),
    inputCount: index + 1,
    deploymentTimestamp: Math.floor(Date.now() / 1000),
}));

const defaultProps = {
    dappFactory: {
        dapps,
        dappCount: dapps.length,
    },
    chainId: 5,
    fetching: false,
    pageNumber: 0,
    onChangePageNumber: () => undefined,
};

describe('DAppsList component', () => {
    it('should render dapps list', () => {
        render(<Component {...defaultProps} />);
        expect(screen.getByTestId('dapps-list')).toBeInTheDocument();
    });

    it('should render empty state', () => {
        render(
            <Component
                {...defaultProps}
                dappFactory={{
                    dapps: [],
                    dappCount: 0,
                }}
            />
        );

        expect(screen.getByText('No items')).toBeInTheDocument();
    });

    it('should render spinner', () => {
        render(<Component {...defaultProps} fetching />);
        expect(screen.getByTestId('dapps-list-spinner')).toBeInTheDocument();
    });

    it('should render pagination', () => {
        render(<Component {...defaultProps} />);
        expect(screen.getByTestId('dapps-list-pagination')).toBeInTheDocument();
    });

    it('should render correct number of cards', () => {
        render(<Component {...defaultProps} />);

        expect(screen.getAllByTestId('dapps-list-card').length).toBe(
            dapps.length
        );
    });
});
