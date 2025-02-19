// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { PoolTabNavigation } from '../../../src/components/stake/PoolTabNavigation';
import { NextRouter, useRouter } from 'next/router';
import { withChakraTheme } from '../../test-utilities';

jest.mock('next/router', () => {
    const originalModule = jest.requireActual('next/router');
    return {
        __esModule: true,
        ...originalModule,
        useRouter: jest.fn(),
    };
});

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

const EPoolTabNavigation = withChakraTheme(PoolTabNavigation);

describe('PoolTabNavigation', () => {
    // a default configured component
    const renderComponent = () => render(<EPoolTabNavigation />);

    beforeEach(() => {
        // default mock return
        mockUseRouter.mockReturnValue({
            query: {
                pool: '0x51937974a767da96dc1c3f9a7b07742e256f0ffe',
            },
        } as unknown as NextRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should display pool info label', () => {
        renderComponent();
        expect(screen.getByText('Pool Info')).toBeInTheDocument();
    });

    it('Should display stake label', () => {
        renderComponent();
        expect(screen.getByText('Stake')).toBeInTheDocument();
    });

    it('Should display manage label', () => {
        renderComponent();
        expect(screen.getByText('Manage')).toBeInTheDocument();
    });
});
