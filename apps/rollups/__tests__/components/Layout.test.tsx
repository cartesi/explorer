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
import {
    PageLayout,
    Props,
    headerLinks,
    footerLinks,
} from '../../src/components/Layout';

const Component = withChakraTheme<Props>(PageLayout);

describe('PageLayout component', () => {
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
