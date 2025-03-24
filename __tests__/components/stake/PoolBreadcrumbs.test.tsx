// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import {
    PoolBreadcrumbs,
    IPoolBreadcrumbsProps,
} from '../../../src/components/stake/PoolBreadcrumbs';
import { useParams } from 'next/navigation';
import { withChakraTheme } from '../../test-utilities';

jest.mock('next/navigation', () => {
    const originalModule = jest.requireActual('next/navigation');
    return {
        __esModule: true,
        ...originalModule,
        useParams: jest.fn(),
    };
});

const useParamsMock = useParams as jest.MockedFunction<typeof useParams>;

const defaultProps = {
    currentPage: 'stake',
};

const EPoolBreadcrumbs =
    withChakraTheme<IPoolBreadcrumbsProps>(PoolBreadcrumbs);

describe('Pool Breadcrumbs', () => {
    // a default configured component
    const renderComponent = () =>
        render(<EPoolBreadcrumbs {...defaultProps} />);

    beforeEach(() => {
        // default mock return
        useParamsMock.mockReturnValue({
            pool: '0x51937974a767da96dc1c3f9a7b07742e256f0ffe',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should display pool link', () => {
        renderComponent();
        expect(screen.getByText('Pool')).toBeInTheDocument();
    });

    it('Should display current page link', () => {
        renderComponent();
        expect(screen.getByText(defaultProps.currentPage)).toBeInTheDocument();
    });
});
