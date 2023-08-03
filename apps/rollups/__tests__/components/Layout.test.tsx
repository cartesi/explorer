// Copyright (C) 2023 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { render, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import {
    PageLayout,
    Props,
    footerLinks,
    headerLinks,
} from '../../src/components/Layout';
import { withChakraTheme } from '../test-utilities';

const Component = withChakraTheme<Props>(PageLayout);
jest.mock('next/router', () => {
    const originalModule = jest.requireActual('next/router');
    return {
        __esModule: true,
        ...originalModule,
        useRouter: jest.fn(),
    };
});
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
describe('PageLayout component', () => {
    beforeEach(() => {
        mockUseRouter.mockReturnValue({
            asPath: 'stake',
        } as unknown as NextRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should render correct header links', () => {
        render(
            <Component>
                <div>Test ABC</div>
            </Component>
        );

        headerLinks.forEach((link) => {
            expect(screen.getByText(link.label)).toBeInTheDocument();
        });
    });

    it('should render correct footer links', () => {
        render(
            <Component>
                <div>Test ABC</div>
            </Component>
        );

        footerLinks.forEach((link) => {
            expect(screen.getByText(link.label)).toBeInTheDocument();
        });
    });
});
