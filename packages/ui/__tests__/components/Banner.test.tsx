// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { render, screen } from '@testing-library/react';
import Banner, { BannerProps } from '../../src/components/Banner';
import { withChakraTheme } from '../test-utilities';

const defaultProps = {
    Title: <span>Title</span>,
};
const Component = withChakraTheme<BannerProps>(Banner);

describe('Banner component', () => {
    const renderComponent = (props = {}) =>
        render(
            <Component {...defaultProps} {...props}>
                Content
            </Component>
        );

    it('should display icon', () => {
        renderComponent({
            Icon: <div data-testid="banner-icon" />,
        });

        expect(screen.getByTestId('banner-icon')).toBeInTheDocument();
    });

    it('should not display icon', () => {
        renderComponent();

        expect(() => screen.getByTestId('banner-icon')).toThrow(
            'Unable to find an element'
        );
    });
});
