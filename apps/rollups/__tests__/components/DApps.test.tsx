// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { withChakraTheme } from '../test-utilities';
import { DApps, DAppsProps } from '../../src/components/DApps';
import { DApp } from '../../src/generated/graphql/0.8';

const Component = withChakraTheme<DAppsProps>(DApps);

const dapps = Array.from({ length: 3 }).map((_, index) => ({
    id: String(index + 1),
    inputCount: index + 1,
    deploymentTimestamp: Math.floor(Date.now() / 1000),
}));

const defaultProps = {
    dapps: dapps as DApp[],
    chainId: 5,
};

describe('DApps component', () => {
    it('should render dapps list', () => {
        render(<Component {...defaultProps} />);
        expect(screen.getAllByTestId('dapps-card').length).toBe(dapps.length);
    });

    it('should render an alert when no dapps are available', () => {
        render(<Component {...defaultProps} dapps={[]} />);
        expect(screen.getByText('No DApps instantiated')).toBeInTheDocument();
    });
});
